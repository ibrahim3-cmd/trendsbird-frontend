import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Shield, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { CanAccess } from "@/components/CanAccess";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/redux/features/role/role.api";
import { DEV_DEFAULTS } from "@/constants/devDefaults";
import { useGetPermissionGroupsQuery } from "@/redux/features/permission/permission.api";
import { IRole } from "@/types";
import {
  createRoleSchema,
  updateRoleSchema,
  CreateRoleFormValues,
} from "@/validations/role.schema";

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: rolesResp, isLoading } = useGetRolesQuery({ search, page, limit });
  const { data: permissionsResp } = useGetPermissionGroupsQuery({});
  const roles: any[] = rolesResp?.roles || [];
  const permissionGroups: any[] = permissionsResp?.data?.groups || [];
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IRole | null>(null);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(editingRole ? updateRoleSchema : createRoleSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      permissionIds: [],
    },
  });

  const selectedPermissionIds = form.watch("permissionIds") ?? [];

  const openCreate = () => {
    setEditingRole(null);
    form.reset({ name: "", description: "", isActive: true, permissionIds: [] });
    setDialogOpen(true);
  };

  const openEdit = (role: IRole) => {
    if (role.name === DEV_DEFAULTS.LIMITED_ROLE_NAME) {
      toast.error("Cannot edit default system role");
      return;
    }
    setEditingRole(role);
    form.reset({
      name: role.name,
      description: role.description ?? "",
      isActive: role.isActive,
      permissionIds: role.rolePerms?.map((item) => item.permissionId) ?? [],
    });
    setDialogOpen(true);
  };

  const togglePermission = (permissionId: number, checked: boolean) => {
    const current = form.getValues("permissionIds") ?? [];
    form.setValue(
      "permissionIds",
      checked ? [...current, permissionId] : current.filter((id) => id !== permissionId),
      { shouldDirty: true }
    );
  };

  const onSubmit = async (values: CreateRoleFormValues) => {
    try {
      if (editingRole) {
        await updateRole({ id: editingRole.id, body: values }).unwrap();
        toast.success("Role updated");
      } else {
        await createRole(values).unwrap();
        toast.success("Role created");
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save role");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRole(deleteTarget.id).unwrap();
      toast.success("Role deleted");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete role");
    }
  };

  const permissionCountByRole = useMemo(() => {
    return new Map(roles.map((role) => [role.id, role.rolePerms?.length ?? 0]));
  }, [roles]);

  const grantAllPermissions = () => {
    const allIds = permissionGroups.flatMap((group) => group.permissions?.map((p: any) => p.id) ?? []);
    form.setValue("permissionIds", Array.from(new Set(allIds)), { shouldDirty: true });
  };

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Create roles and assign permissions."
        icon={Shield}
        action={
          <CanAccess permission="role:create">
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </CanAccess>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
        <Input
          placeholder="Search roles"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {roles.length} of {rolesResp?.total ?? 0}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>System</TableHead>
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
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || "—"}</TableCell>
                  <TableCell>{role.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>{permissionCountByRole.get(role.id) ?? 0}</TableCell>
                  <TableCell>{role._count?.users ?? 0}</TableCell>
                  <TableCell>{role.isSystem ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <CanAccess permission="role:update">
                      <Button variant="outline" size="sm" onClick={() => openEdit(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                    <CanAccess permission="role:delete">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={role.isSystem || role.name === DEV_DEFAULTS.LIMITED_ROLE_NAME}
                        onClick={() => {
                          if (role.name === DEV_DEFAULTS.LIMITED_ROLE_NAME) {
                            toast.error("Cannot delete default system role");
                            return;
                          }
                          setDeleteTarget(role);
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

      <div className="flex items-center justify-between gap-3 mt-4">
        <div className="text-sm text-muted-foreground">
          Page {page} of {Math.max(1, Math.ceil((rolesResp?.total ?? 0) / limit))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.max(1, Math.ceil((rolesResp?.total ?? 0) / limit))}
            onClick={() => setPage((prev) => Math.min(Math.max(1, Math.ceil((rolesResp?.total ?? 0) / limit)), prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
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
                      <Input placeholder="Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Role description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox checked={field.value ?? true} onCheckedChange={(checked) => field.onChange(checked)} />
                    </FormControl>
                    <FormLabel className="mb-0">Active</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={grantAllPermissions}>
                  Grant all permissions
                </Button>
              </div>
              <FormItem>
                <FormLabel>Permissions</FormLabel>
                <div className="flex flex-col gap-4 max-h-96 overflow-y-auto rounded-md border p-4 bg-muted/10">
                  {(permissionGroups as any[])?.map((group: any) => (
                    <div key={group.id} className="border bg-card rounded p-3">
                      <div className="font-semibold text-sm capitalize mb-2 pb-2 border-b flex items-center justify-between">
                        <span>{group.name} Module</span>
                        <div className="flex items-center gap-2">
                          <label className="text-xs cursor-pointer flex items-center gap-1.5 font-normal text-muted-foreground">
                            <Checkbox 
                              checked={group.permissions?.every((p: any) => selectedPermissionIds.includes(p.id))}
                              onCheckedChange={(c) => {
                                const groupPermIds = group.permissions?.map((p: any) => p.id) || [];
                                let current = [...selectedPermissionIds];
                                if (c) {
                                  current = Array.from(new Set([...current, ...groupPermIds]));
                                } else {
                                  current = current.filter(id => !groupPermIds.includes(id));
                                }
                                form.setValue("permissionIds", current, { shouldDirty: true });
                              }}
                            />
                            Select All
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {group.permissions?.map((permission: any) => {
                          const action = permission.name.split(":")[1] || permission.name;
                          return (
                            <label key={permission.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded">
                              <Checkbox
                                checked={selectedPermissionIds.includes(permission.id)}
                                onCheckedChange={(checked) => togglePermission(permission.id, Boolean(checked))}
                              />
                              <span className="capitalize">{action}</span>
                            </label>
                          );
                        })}
                        {!group.permissions?.length && (
                          <span className="text-xs text-muted-foreground italic col-span-full">No permissions</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {!(permissionGroups as any[])?.length && (
                    <div className="text-sm text-muted-foreground text-center py-4">No permissions loaded</div>
                  )}
                </div>
              </FormItem>
              <DialogFooter>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingRole ? "Save Changes" : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete role?"
        description={`This will permanently delete ${deleteTarget?.name}.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
