import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Award, Plus, Trash2, Edit2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanAccess } from "@/components/CanAccess";
import { useGetBrandsQuery, useDeleteBrandMutation, useCreateBrandMutation, useUpdateBrandMutation } from "@/redux/features/brand/brand.api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useGetBrandsQuery({ search, isActive: status === "all" ? undefined : status === "true", page, limit });
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const [deleteBrand] = useDeleteBrandMutation();
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialForm = {
    id: 0,
    name: "",
    description: "",
    logoId: null as number | null,
    isActive: true,
    logoObj: null as any
  };
  const [form, setForm] = useState(initialForm);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      await deleteBrand(id).unwrap();
      toast.success("Brand deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ ...initialForm });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: any) => {
    setIsEditing(true);
    setForm({
      id: brand.id,
      name: brand.name,
      description: brand.description || "",
      logoId: brand.logoId,
      isActive: brand.isActive,
      logoObj: brand.logo
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        logoId: form.logoId,
        isActive: form.isActive,
      };

      if (isEditing) {
        await updateBrand({ id: form.id, data: payload }).unwrap();
        toast.success("Brand updated");
      } else {
        await createBrand(payload).unwrap();
        toast.success("Brand created");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save brand");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Brands"
        description="Manage product brands and manufacturers"
        icon={Award}
        action={
          <CanAccess permission="brand:create">
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="h-4 w-4" /> Add Brand
            </Button>
          </CanAccess>
        }
      />

      <div className="grid gap-3 md:grid-cols-3 items-end">
        <div className="grid gap-2 md:col-span-2">
          <Label>Search</Label>
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search brand name" />
        </div>
        <div className="grid gap-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-muted-foreground">Loading brands...</div>
        ) : (
          data?.data?.brands?.map((brand: any) => (
            <div key={brand.id} className="bg-card border rounded-lg p-4 flex flex-col items-center text-center gap-3 relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 rounded-full border bg-muted flex items-center justify-center overflow-hidden">
                {brand.logo ? (
                  <img src={brand.logo.thumbnailUrl || brand.logo.publicUrl} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{brand.name}</h3>
                {!brand.isActive && <span className="text-[10px] text-destructive">Inactive</span>}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <CanAccess permission="brand:update">
                  <Button size="icon" variant="secondary" onClick={() => openEditModal(brand)} className="h-7 w-7 rounded-full">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </CanAccess>
                <CanAccess permission="brand:delete">
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(brand.id)} className="h-7 w-7 rounded-full">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CanAccess>
              </div>
            </div>
          ))
        )}
        {data?.data?.brands?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No brands found. Add your first brand.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Brand" : "Add Brand"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Brand Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 border rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {form.logoObj ? (
                    <img src={form.logoObj.thumbnailUrl || form.logoObj.publicUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
                  )}
                </div>
                <Button variant="outline" onClick={() => setIsMediaPickerOpen(true)}>Choose Logo</Button>
                {form.logoId && (
                  <Button variant="ghost" className="text-destructive" onClick={() => setForm({ ...form, logoId: null, logoObj: null })}>Remove</Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(c) => setForm({ ...form, isActive: c })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        multiple={false}
        onSelect={(media) => {
          if (media.length > 0) {
            setForm({ ...form, logoId: media[0].id, logoObj: media[0] });
          }
        }}
      />
    </div>
  );
}
