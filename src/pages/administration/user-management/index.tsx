import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApproveRejectUserMutation, useGetUsersQuery } from "@/redux/features/user/user.api";
import { GetUserQuery, IsActive, IUser } from "@/types";
import { Ban, ChevronLeft, ChevronRight, Search, ShieldCheck, Plus, Edit, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddEditUserModal from "./components/AddEditUserModal";
import PermissionSetupModal from "./components/PermissionSetupModal";
import LoginAsConfirmationModal from "./components/LoginAsConfirmationModal";
// import EditUserFeaturesModal from "./components/EditUserFeaturesModal";
//import { PageHeader } from "@/components/ui/PageHeader";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { useUserInfoQuery, useLoginByEmailAndRoleMutation } from "@/redux/features/auth/auth.api";
// import { useGetAllRolesQuery, useGetAvailableRolesForOrgQuery } from "@/redux/features/role/roleApiSlice";

import AddEditAgentModal from "./components/AddEditAgentModal";
import { SearchSelect } from "@/components/ui/SearchSelect";

const statusColor = (s: IsActive) =>
  s === "ACTIVE"
    ? "bg-green-100 text-green-700"
    : s === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : s === "BLOCKED"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";

const StatusBadge = ({ value }: { value: IsActive }) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      statusColor(value)
    )}
  >
    {value}
  </span>
);

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const ManageUserPage = () => {
  const navigate = useNavigate();
  // query state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isActive, setIsActive] = useState<IsActive | "ALL">("ALL");
  const [role, setRole] = useState<string>("ALL");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("ALL");

  const { data: userData } = useUserInfoQuery(undefined);
  const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";

  // console.log("data = ",userData?.data?.role)

  // Dynamic roles for filter (from backend)
  // const { data: rolesAllResp } = useGetAllRolesQuery(
  //   isSuperAdmin ? { page: 1, limit: 999999 } : skipToken
  // );
  // const { data: rolesAvailableResp } = useGetAvailableRolesForOrgQuery(
  //   isSuperAdmin ? skipToken : undefined
  // );

  // const roleOptions = useMemo(() => {
  //   const fallback: Array<{ key: string; name: string }> = [
  //     { key: "SUPER_ADMIN", name: "Super Admin" },
  //     { key: "ADMIN", name: "Admin" },
  //     { key: "USER", name: "User" },
  //   ];

  //   const raw: IRole[] = isSuperAdmin
  //     ? (rolesAllResp?.data ?? [])
  //     : (rolesAvailableResp?.data ?? []);

  //   const uniqueByKey = new Map<string, IRole>();
  //   for (const r of raw) {
  //     if (!r?.key) continue;
  //     uniqueByKey.set(r.key, r);
  //   }

  //   let options = Array.from(uniqueByKey.values())
  //     .map((r) => ({ key: r.key, name: r.name || r.key }))
  //     .sort((a, b) => a.name.localeCompare(b.name));

  //   if (!options.length) options = fallback;
  //   if (!isSuperAdmin) options = options.filter((r) => r.key !== "SUPER_ADMIN");
  //   return options;
  // }, [isSuperAdmin, rolesAllResp?.data, rolesAvailableResp?.data]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  // Agent Modal state
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<IUser | null>(null);

  // Permission setup modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [newlyCreatedUser, setNewlyCreatedUser] = useState<IUser | null>(null);

  // Login as modal state
  const [isLoginAsModalOpen, setIsLoginAsModalOpen] = useState(false);
  const [selectedUserForLogin, setSelectedUserForLogin] = useState<IUser | null>(null);

  const { data: allOrgs } = useGetAllOrgQuery({
    page: 1,
    limit: 99999999,
  });

  const debouncedSearch = useDebounced(search);

  const queryArgs: GetUserQuery = useMemo(
    () => ({
      page,
      limit,
      searchTerm: debouncedSearch,
      isActive,
      role,
      orgId: selectedOrgId !== "ALL" ? selectedOrgId : undefined,
    }),
    [page, limit, debouncedSearch, isActive, role, selectedOrgId]
  );

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery(queryArgs);
  const [mutateStatus, { isLoading: isActing }] =
    useApproveRejectUserMutation();
  const [loginByEmailAndRole, { isLoading: isLoggingIn }] = useLoginByEmailAndRoleMutation();


  const total = data?.meta?.total ?? 0;
  const totalPages =
    data?.meta?.totalPages ??
    Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  const onApprove = async (u: IUser) => {
    try {
      await mutateStatus({ id: u._id, isActive: "ACTIVE" }).unwrap();
      refetch();
      toast.success(`Unblock ${u.name}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to approve agent");
    }
  };

  const onReject = async (u: IUser) => {
    try {
      await mutateStatus({ id: u._id, isActive: "BLOCKED" }).unwrap();
      refetch();
      toast.success(`Blocked ${u.name}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to reject agent");
    }
  };

  const onResetFilters = () => {
    setPage(1);
    setLimit(10);
    setSearch("");
    setIsActive("ALL");
    setRole("ALL");
    setSelectedOrgId("ALL");
  };

  // Modal handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  const handleAddAgent = () => {
    setEditingAgent(null);
    setIsAgentModalOpen(true);
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleEditFeatures = (user: IUser) => {
    navigate(`/administration/${user._id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handlePermissionSetupConfirm = () => {
    if (newlyCreatedUser) {
      navigate(`/administration/${newlyCreatedUser._id}`);
    }
  };

  const handlePermissionSetupClose = () => {
    setIsPermissionModalOpen(false);
    setNewlyCreatedUser(null);
  };

  const handleModalSuccess = (createdUser?: IUser) => {
    refetch();

    // If a new user was created, show permission setup modal
    if (createdUser && !editingUser) {
      setNewlyCreatedUser(createdUser);
      setIsPermissionModalOpen(true);
    }

    handleCloseModal();
  };

  const handleEditAgent = (agent: IUser) => {
    setEditingAgent(agent);
    setIsAgentModalOpen(true);
  };
  const handleCloseAgentModal = () => {
    setIsAgentModalOpen(false);
    setEditingAgent(null);
  };

  const handleAgentModalSuccess = (createdAgent?: IUser) => {
    refetch();

    // If a new agent was created, show permission setup modal
    if (createdAgent && !editingAgent) {
      setNewlyCreatedUser(createdAgent);
      setIsPermissionModalOpen(true);
    }

    handleCloseAgentModal();
  };


  const handleLoginAs = (user: IUser) => {
    // Check if user is verified
    if (!user.isVerified) {
      toast.error("This user has not verified their account yet.");
      return;
    }
    
    setSelectedUserForLogin(user);
    setIsLoginAsModalOpen(true);
  };

  const handleLoginAsConfirm = async () => {
    if (!selectedUserForLogin || !userData?.data) return;

    try {
      // Save current admin user data to localStorage
      const currentUserData = [
        {
          name: userData.data.name,
          email: userData.data.email,
          role: userData.data.role,
        },
      ];
      localStorage.setItem("TAINC_USER", JSON.stringify(currentUserData));
      
      // Save current path to return to when switching back
      localStorage.setItem("ADMIN_PATH", window.location.pathname);

      // Login as the selected user
      await loginByEmailAndRole({
        email: selectedUserForLogin.email,
        role: selectedUserForLogin.role,
      }).unwrap();

      toast.success(`Successfully logged in as ${selectedUserForLogin.name}`);
      setIsLoginAsModalOpen(false);
      setSelectedUserForLogin(null);
      
      // Refresh the page or redirect
      window.location.href = "/";
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to login as user");
    }
  };

  const handleLoginAsClose = () => {
    setIsLoginAsModalOpen(false);
    setSelectedUserForLogin(null);
  };

   const isAgent = (user: IUser) => user.role === 'SUPPORT_AGENT';

  const loading = isLoading || isFetching;
  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Manage Users"
        icon={Users}
        // tabs={profileTabs}
      /> */}

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">All Users</p>
            <div className="flex gap-2">
             {userData?.data?.role === 'SUPER_ADMIN' && <Button onClick={handleAddAgent} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Agent
                </Button>}
              
                <Button onClick={handleAddUser} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
      </div>
          </div>
          
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3"> 
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, phone..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            {
              userData?.data?.role === "SUPER_ADMIN" ? (
                <div className="md:col-span-2">
                  <SearchSelect
                    options={[
                      { label: "All Organization", value: "ALL" },
                      ...(allOrgs?.data?.map((org: { _id: string; orgName: string }) => ({
                        label: org.orgName,
                        value: org._id
                      })) || [])
                    ]}
                    value={selectedOrgId}
                    onChange={(value) => {
                      setPage(1);
                      setSelectedOrgId(value);
                    }}
                    placeholder="All Organization"
                    searchPlaceholder="Search organization..."
                  />
                </div>
              ) : null
            }
            
            <div className="md:col-span-2">
              <select
                className="w-full h-9 border rounded-md px-3 bg-background"
                value={isActive}
                onChange={(e) => {
                  setPage(1);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setIsActive(e.target.value as any);
                }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                className="w-full h-9 border rounded-md px-3 bg-background"
                value={role}
                onChange={(e) => {
                  setPage(1);
                  setRole(e.target.value);
                }}
              >
                <option value="ALL">All Role</option>
                <option key={"ADMIN"} value={"ADMIN"}>
                    {"ADMIN"}
                  </option>
                <option key={"CREW"} value={"CREW"}>
                    {"CREW"}
                  </option>
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                className="w-full h-9 border rounded-md px-3 bg-background"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/page
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1 flex">
              <Button
                variant="outline"
                className="w-full"
                onClick={onResetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  {
                    userData?.data?.role === "SUPER_ADMIN" ? <th className="py-2.5 px-3">Organization</th> : null
                  }
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? // skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-t">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={`sk-${i}-${j}`} className="py-3 px-3">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                  : data?.data?.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="py-3 px-3">{u.name}</td>
                      <td className="py-3 px-3">{u.email}</td>
                      {
                        userData?.data?.role === "SUPER_ADMIN" ? <td className="py-3 px-3">{u?.org?.orgName || "—"}</td> : null
                      }
                      <td className="py-3 px-3">{u.phone ?? "—"}</td>
                        <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {u.isOrgOwner && <ShieldCheck className="h-4 w-4 text-primary" />}
                          {u.role ?? "—"}
                        </div>
                        </td>
                      <td className="py-3 px-3">
                        <StatusBadge value={u.isActive} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1 justify-end">
                          {/* <PermissionGate feature="manage-user" action="login_as"> */}
                            {(isSuperAdmin || userData?.data?.role === "ADMIN") && (
                              <Button
                                size="sm"
                                onClick={() => handleLoginAs(u)}
                                disabled={isActing || isLoggingIn || u._id === userData?.data?._id}
                                // className="bg-primary text-primary-text"
                              >
                                <LogIn className="h-4 w-4" />
                                {/* Login as */}
                              </Button>
                            )}
                          {/* </PermissionGate> */}
                          <Button
                              size="sm"
                              variant="outline"
                              // onClick={() => handleEditUser(u)}
                              onClick={() => isAgent(u) ? handleEditAgent(u) : handleEditUser(u)}
                              disabled={isActing}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditFeatures(u)}
                              disabled={isActing}
                              className="flex items-center border border-primary text-primary gap-1"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              Features
                            </Button>
                          {u.isActive === "BLOCKED" && (
                            <Button
                                size="sm"
                                onClick={() => onApprove(u)}
                                disabled={isActing || u._id === userData?.data?._id}
                                title={u._id === userData?.data?._id ? "You cannot change your own status" : undefined}
                              >
                                <ShieldCheck className="h-4 w-4 mr-1" /> Unblock
                              </Button>
                          )}
                          {u.isActive === "ACTIVE" && (
                            u._id === userData?.data?._id ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="opacity-50 cursor-not-allowed"
                                  title="You cannot block yourself"
                                >
                                  <Ban className="h-4 w-4 mr-1" /> Block
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => onReject(u)}
                                  disabled={isActing}
                                >
                                  <Ban className="h-4 w-4 mr-1" /> Block
                                </Button>
                              )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {!isLoading && (data?.data?.length ?? 0) === 0 && (
                  <tr className="border-t">
                    <td
                      className="py-6 px-3 text-center text-muted-foreground"
                      colSpan={7}
                    >
                      No Users Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {Math.min((page - 1) * limit + 1, total)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Modal */}
      <AddEditUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editUser={editingUser}
      />

      <AddEditAgentModal
        isOpen={isAgentModalOpen}
        onClose={handleCloseAgentModal}
        onSuccess={handleAgentModalSuccess}
        editAgent={editingAgent}
      />

      {/* Permission Setup Modal */}
      <PermissionSetupModal
        isOpen={isPermissionModalOpen}
        onClose={handlePermissionSetupClose}
        onConfirm={handlePermissionSetupConfirm}
        user={newlyCreatedUser}
      />

      {/* Login As Confirmation Modal */}
      <LoginAsConfirmationModal
        isOpen={isLoginAsModalOpen}
        onClose={handleLoginAsClose}
        onConfirm={handleLoginAsConfirm}
        user={selectedUserForLogin}
        isLoading={isLoggingIn}
      />
    </div>
  );
};

export default ManageUserPage;