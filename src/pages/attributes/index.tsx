import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Layers, Plus, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanAccess } from "@/components/CanAccess";
import { useGetAttributesQuery, useDeleteAttributeMutation, useCreateAttributeMutation, useUpdateAttributeMutation } from "@/redux/features/attribute/attribute.api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaPicker } from "@/components/ui/MediaPicker";

export default function AttributesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useGetAttributesQuery({ search, page, limit });
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [createAttribute] = useCreateAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerIndex, setMediaPickerIndex] = useState<number | null>(null);
  
  const initialForm = {
    id: 0,
    name: "",
    type: "dropdown" as "dropdown" | "radio" | "checkbox" | "colour" | "image",
    values: [] as { id?: number; value: string; slug?: string; colorCode?: string; referenceMediaId?: number; referenceMedia?: any }[],
  };
  const [form, setForm] = useState(initialForm);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this attribute? Ensure it is not used in products.")) return;
    try {
      await deleteAttribute(id).unwrap();
      toast.success("Attribute deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ ...initialForm });
    setIsModalOpen(true);
  };

  const openEditModal = (attr: any) => {
    setIsEditing(true);
    setForm({
      id: attr.id,
      name: attr.name,
      type: attr.type,
      values: attr.values.map((v: any) => ({
        id: v.id,
        value: v.value,
        slug: v.slug,
        colorCode: v.colorCode,
        referenceMediaId: v.referenceMediaId,
        referenceMedia: v.referenceMedia,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        type: form.type,
        values: form.values
          .filter((v) => v.value.trim() !== "")
          .map((v) => ({
            id: v.id,
            value: v.value,
            slug: v.slug,
            colorCode: v.colorCode,
            referenceMediaId: v.referenceMediaId,
          })),
      };

      if (isEditing) {
        await updateAttribute({ id: form.id, data: payload }).unwrap();
        toast.success("Attribute updated");
      } else {
        await createAttribute(payload).unwrap();
        toast.success("Attribute created");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save attribute");
    }
  };

  const addValue = () => {
    setForm({ ...form, values: [...form.values, { value: "", slug: "", colorCode: form.type === "colour" ? "#000000" : undefined, referenceMediaId: undefined }] });
  };

  const removeValue = (index: number) => {
    const newValues = [...form.values];
    newValues.splice(index, 1);
    setForm({ ...form, values: newValues });
  };

  const updateValue = (index: number, key: 'value' | 'slug' | 'colorCode' | 'referenceMediaId', val: string | number | undefined) => {
    const newValues = [...form.values];
    newValues[index] = { ...newValues[index], [key]: val };
    setForm({ ...form, values: newValues });
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Attributes"
        description="Manage product variations (e.g. Size, Color)"
        icon={Layers}
        action={
          <CanAccess permission="attribute:create">
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="h-4 w-4" /> Add Attribute
            </Button>
          </CanAccess>
        }
      />

      <div className="grid gap-2 md:grid-cols-2 items-end">
        <div className="grid gap-2 md:col-span-2">
          <Label>Search</Label>
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search attribute name" />
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading attributes...</div>
        ) : (
          <div className="divide-y">
            {data?.data?.attributes?.map((attr: any) => (
              <div key={attr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30">
                <div className="flex-1">
                  <div className="font-semibold">{attr.name} <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-0.5 border rounded-full uppercase bg-muted">{attr.type}</span></div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attr.values.map((v: any) => (
                      <div key={v.id} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded border flex items-center gap-1.5">
                        {attr.type === "color" && v.colorCode && (
                          <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: v.colorCode }} />
                        )}
                        {v.value}
                      </div>
                    ))}
                    {attr.values.length === 0 && <span className="text-xs text-muted-foreground italic">No values defined</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <CanAccess permission="attribute:update">
                    <Button size="sm" variant="secondary" onClick={() => openEditModal(attr)}>
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </CanAccess>
                  <CanAccess permission="attribute:delete">
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(attr.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CanAccess>
                </div>
              </div>
            ))}
            {data?.data?.attributes?.length === 0 && (
              <div className="p-12 text-center text-muted-foreground border-dashed">
                No attributes found. Create one to define product variants.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" disabled={!data?.data?.attributes || data.data.attributes.length < limit} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Attribute" : "Add Attribute"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Attribute Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Size, Color"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(val: any) => setForm({ ...form, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="colour">Colour Swatch</SelectItem>
                  <SelectItem value="image">Image Swatch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Attribute Values</Label>
              <Button type="button" variant="outline" size="sm" onClick={addValue} className="h-7 px-2 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add Value
              </Button>
            </div>

            <ScrollArea className="max-h-[300px] pr-2">
              <div className="flex flex-col gap-2">
                {form.values.map((v, index) => (
                  <div key={index} className="grid gap-2 border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={v.value}
                        onChange={(e) => updateValue(index, "value", e.target.value)}
                        placeholder="Value name (e.g. XL, Red)"
                        className="flex-1"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeValue(index)} className="h-8 w-8 text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        value={v.slug || ""}
                        onChange={(e) => updateValue(index, "slug", e.target.value)}
                        placeholder="Optional value slug"
                      />
                      {form.type === "colour" && (
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center gap-1 w-full">
                            <input
                              type="color"
                              value={v.colorCode || "#000000"}
                              onChange={(e) => updateValue(index, "colorCode", e.target.value)}
                              className="absolute opacity-0 w-full h-full cursor-pointer"
                            />
                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: v.colorCode || "#000000" }} />
                            <Input
                              value={v.colorCode || ""}
                              onChange={(e) => updateValue(index, "colorCode", e.target.value)}
                              className="flex-1 px-1 h-8 text-xs font-mono"
                              placeholder="#HEX"
                            />
                          </div>
                        </div>
                      )}
                      {form.type === "image" && (
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={() => { setMediaPickerIndex(index); setIsMediaPickerOpen(true); }}>
                            {v.referenceMedia ? "Change media" : "Choose media"}
                          </Button>
                          {v.referenceMedia && (
                            <img src={v.referenceMedia.thumbnailUrl || v.referenceMedia.publicUrl} alt="Reference" className="h-10 w-10 rounded border object-cover" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {form.values.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded">
                    No values added yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || form.values.some(v => !v.value)}>Save Attribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
