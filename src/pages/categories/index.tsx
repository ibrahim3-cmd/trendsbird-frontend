import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tags, Plus, Trash2, Edit2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanAccess } from "@/components/CanAccess";
import { useGetCategoriesQuery, useDeleteCategoryMutation, useCreateCategoryMutation, useUpdateCategoryMutation } from "@/redux/features/category/category.api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery({ tree: true });
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialForm = {
    id: 0,
    name: "",
    description: "",
    parentId: null as number | null,
    imageId: null as number | null,
    isActive: true,
    sortOrder: 0,
    imageObj: null as any,
  };

  const flattenCategories = (categories: any[], level = 0): any[] =>
    categories.flatMap((cat) => [
      { ...cat, level },
      ...(cat.children ? flattenCategories(cat.children, level + 1) : []),
    ]);
  const [form, setForm] = useState(initialForm);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category? Ensure it has no products or children.")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const openAddModal = (parentId: number | null = null) => {
    setIsEditing(false);
    setForm({ ...initialForm, parentId });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setIsEditing(true);
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description || "",
      parentId: cat.parentId,
      imageId: cat.imageId,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      imageObj: cat.image
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        parentId: form.parentId,
        imageId: form.imageId,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
      };

      if (isEditing) {
        await updateCategory({ id: form.id, data: payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save category");
    }
  };

  const renderTree = (categories: any[], level = 0) => {
    if (!categories) return null;
    return categories.map((cat) => (
      <React.Fragment key={cat.id}>
        <div className={`flex items-center justify-between p-3 border-b hover:bg-muted/50 ${level > 0 ? "bg-muted/20" : ""}`}>
          <div className="flex items-center gap-4" style={{ paddingLeft: `${level * 2}rem` }}>
            <div className="h-10 w-10 bg-background border rounded overflow-hidden flex items-center justify-center shrink-0">
              {cat.image ? (
                <img src={cat.image.thumbnailUrl || cat.image.publicUrl} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground opacity-50" />
              )}
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                {cat.name}
                {!cat.isActive && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">Inactive</span>}
              </div>
              <div className="text-xs text-muted-foreground">/{cat.slug}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CanAccess permission="category:create">
              <Button size="sm" variant="outline" onClick={() => openAddModal(cat.id)}>
                Add Sub
              </Button>
            </CanAccess>
            <CanAccess permission="category:update">
              <Button size="sm" variant="secondary" onClick={() => openEditModal(cat)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </CanAccess>
            <CanAccess permission="category:delete">
              <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CanAccess>
          </div>
        </div>
        {cat.children && cat.children.length > 0 && renderTree(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Categories"
        description="Manage product categories and sub-categories"
        icon={Tags}
        action={
          <CanAccess permission="category:create">
            <Button onClick={() => openAddModal(null)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </CanAccess>
        }
      />

      <div className="bg-card border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
        ) : (
          <div className="flex flex-col">
            {data?.data?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No categories found.</div>
            ) : (
              renderTree(data?.data || [])
            )}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Category Image</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 border rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {form.imageObj ? (
                    <img src={form.imageObj.thumbnailUrl || form.imageObj.publicUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
                  )}
                </div>
                <Button variant="outline" onClick={() => setIsMediaPickerOpen(true)}>Choose Image</Button>
                {form.imageId && (
                  <Button variant="ghost" className="text-destructive" onClick={() => setForm({ ...form, imageId: null, imageObj: null })}>Remove</Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                value={form.parentId !== null ? String(form.parentId) : "none"}
                onValueChange={(value) => setForm({ ...form, parentId: value === "none" ? null : Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent</SelectItem>
                  {flattenCategories(data?.data || [])
                    .filter((category: any) => category.id !== form.id)
                    .map((category: any) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {" ".repeat(category.level * 2)}{category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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

            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
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
            setForm({ ...form, imageId: media[0].id, imageObj: media[0] });
          }
        }}
      />
    </div>
  );
}
