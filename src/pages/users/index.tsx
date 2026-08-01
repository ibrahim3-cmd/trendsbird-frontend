import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Users, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { CanAccess } from "@/components/CanAccess";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/user.api";
import { DEV_DEFAULTS } from "@/constants/devDefaults";
import { useGetRolesQuery } from "@/redux/features/role/role.api";
import { IUser } from "@/types";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserFormValues,
  UpdateUserFormValues,
} from "@/validations/user.schema";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: userResponse, isLoading } = useGetUsersQuery({
    search,
    roleId: roleId === "all" ? undefined : Number(roleId),
    isActive: status === "all" ? undefined : status === "active",
    page,
    limit,
  });
  const users: any[] = userResponse?.users || [];
  const { data: rolesResp } = useGetRolesQuery({ page: 1, limit: 100 });
  const roles: any[] = rolesResp?.roles || [];
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const isEdit = Boolean(editingUser);

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    // Dynamic resolver between create/update modes
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema) as never,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: undefined,
      phone: "",
    },
  });

  const openCreate = () => {
    setEditingUser(null);
    form.reset({ name: "", email: "", password: "", roleId: undefined, phone: "" });
    setDialogOpen(true);
  };

  const openEdit = (user: IUser) => {
    // prevent editing default system users
    if (user.email === DEV_DEFAULTS.SUPER_ADMIN_EMAIL || user.email === DEV_DEFAULTS.CATALOG_USER_EMAIL) {
      toast.error("Cannot edit default system users");
      return;
    }
    setEditingUser(user);
    form.reset({
      name: user.name ?? "",
      email: user.email,
      password: "",
      roleId: user.roleId,
      phone: user.phone ?? "",
      isActive: user.isActive,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: CreateUserFormValues | UpdateUserFormValues) => {
    try {
      if (editingUser) {
        const body: UpdateUserFormValues = { ...values };
        if (!body.password) delete body.password;
        await updateUser({ id: editingUser.id, body }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(values as CreateUserFormValues).unwrap();
        toast.success("User created");
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save user");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      toast.success("User deactivated");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.name, value: String(role.id) })),
    [roles]
  );

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage system users and assign roles."
        icon={Users}
        action={
          <CanAccess permission="user:create">
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </CanAccess>
        }
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:col-span-2"
        />
        <Select value={roleId} onValueChange={(value) => { setRoleId(value); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "—"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name || "—"}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <CanAccess permission="user:update">
                      <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                    <CanAccess permission="user:delete">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (user.email === DEV_DEFAULTS.SUPER_ADMIN_EMAIL || user.email === DEV_DEFAULTS.CATALOG_USER_EMAIL) {
                            toast.error("Cannot delete default system users");
                            return;
                          }
                          setDeleteTarget(user);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {userResponse?.total ?? 0} users
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.max(1, Math.ceil((userResponse?.total ?? 0) / limit))}
            onClick={() => setPage((prev) => Math.min(Math.max(1, Math.ceil((userResponse?.total ?? 0) / limit)), prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEdit ? "New Password (optional)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEdit && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value === undefined ? undefined : String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? "Save Changes" : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Deactivate user?"
        description={`This will deactivate ${deleteTarget?.email}.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
