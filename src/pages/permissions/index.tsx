import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Plus, Pencil, Trash2, Loader2, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { CanAccess } from "@/components/CanAccess";
import {
  useGetPermissionGroupsQuery,
  useCreatePermissionGroupMutation,
  useUpdatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
} from "@/redux/features/permission/permission.api";

export default function PermissionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: response, isLoading } = useGetPermissionGroupsQuery({ search, page, limit });
  const groups = response?.data?.groups || [];
  const ungrouped = response?.data?.ungrouped || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [createGroup, { isLoading: isCreating }] = useCreatePermissionGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdatePermissionGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeletePermissionGroupMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formActions, setFormActions] = useState<string[]>([]);
  const [actionInput, setActionInput] = useState("");

  const openCreate = () => {
    setEditingGroup(null);
    setFormName("");
    setFormDescription("");
    setFormActions(["create", "read", "update", "delete", "watch"]);
    setDialogOpen(true);
  };

  const openEdit = (group: any) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormDescription(group.description || "");
    setFormActions(group.permissions.map((p: any) => p.name.split(":")[1] || p.name));
    setDialogOpen(true);
  };

  const onSubmit = async () => {
    if (!formName) return toast.error("Module name is required");
    try {
      const payload = {
        name: formName,
        description: formDescription,
        actions: formActions
      };

      if (editingGroup) {
        await updateGroup({ id: editingGroup.id, body: payload }).unwrap();
        toast.success("Permission group updated");
      } else {
        await createGroup(payload).unwrap();
        toast.success("Permission group created");
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save permission group");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGroup(deleteTarget.id).unwrap();
      toast.success("Permission group deleted");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete permission group");
    }
  };

  const toggleAction = (action: string) => {
    if (formActions.includes(action)) {
      setFormActions(formActions.filter(a => a !== action));
    } else {
      setFormActions([...formActions, action]);
    }
  };

  const addCustomAction = () => {
    const act = actionInput.trim().toLowerCase();
    if (act && !formActions.includes(act)) {
      setFormActions([...formActions, act]);
    }
    setActionInput("");
  };

  const defaultActionsList = ["create", "read", "update", "delete", "watch", "upload", "download"];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Permissions"
        description="Manage system permissions grouped by modules."
        icon={KeyRound}
        action={
          <CanAccess permission="permission:create">
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Module Permissions
            </Button>
          </CanAccess>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search modules"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          Showing {groups.length} of {total} modules
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: any) => (
              <div key={group.id} className="border bg-card rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg capitalize">{group.name.replace(/_/g, " ")} Module</h3>
                  </div>
                  <div className="flex gap-1">
                    <CanAccess permission="permission:update">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEdit(group)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                    <CanAccess permission="permission:delete">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(group)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CanAccess>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{group.description || "No description provided."}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.permissions?.map((p: any) => {
                      const action = p.name.split(":")[1] || p.name;
                      return (
                        <div key={p.id} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                          {action}
                        </div>
                      );
                    })}
                    {!group.permissions?.length && (
                      <div className="text-sm italic text-muted-foreground">No permissions defined</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {ungrouped.length > 0 && (
              <div className="col-span-full p-4 border rounded-xl bg-background">
                <h4 className="font-semibold">Ungrouped permissions</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ungrouped.map((permission: any) => (
                    <span key={permission.id} className="px-3 py-1 rounded-full border bg-secondary/10 text-secondary text-xs">
                      {permission.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {groups.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-xl">
                No permission groups found. Create one to get started.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
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
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGroup ? "Edit Module Permissions" : "Create Module Permissions"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Module Name</label>
              <Input 
                placeholder="e.g. product, user, order" 
                value={formName} 
                onChange={e => setFormName(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Module description" 
                value={formDescription} 
                onChange={e => setFormDescription(e.target.value)} 
              />
            </div>
            <div className="grid gap-3 pt-2">
              <label className="text-sm font-medium">Allowed Actions</label>
              <div className="flex flex-wrap gap-2">
                {defaultActionsList.map(action => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer text-sm border px-3 py-1.5 rounded-full hover:bg-muted/50">
                    <input 
                      type="checkbox" 
                      checked={formActions.includes(action)} 
                      onChange={() => toggleAction(action)} 
                      className="accent-primary"
                    />
                    <span className="capitalize">{action}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="Custom action (e.g. approve)" 
                  value={actionInput} 
                  onChange={e => setActionInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomAction()}
                />
                <Button type="button" variant="secondary" onClick={addCustomAction}>Add</Button>
              </div>

              {formActions.filter(a => !defaultActionsList.includes(a)).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground w-full">Custom Actions:</span>
                  {formActions.filter(a => !defaultActionsList.includes(a)).map(action => (
                    <label key={action} className="flex items-center gap-2 cursor-pointer text-sm border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-full">
                      <input 
                        type="checkbox" 
                        checked={true} 
                        onChange={() => toggleAction(action)} 
                        className="accent-primary"
                      />
                      <span className="capitalize">{action}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={onSubmit} disabled={isCreating || isUpdating || !formName || formActions.length === 0}>
              {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingGroup ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Module Permissions?"
        description={`This will permanently delete the ${deleteTarget?.name} module and all its associated permissions. This may break existing roles.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
