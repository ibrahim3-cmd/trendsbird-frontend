import React, { useState, useRef } from "react";
import {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} from "@/redux/features/media/media.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Image as ImageIcon, UploadCloud, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CanAccess } from "@/components/CanAccess";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useGetMediaQuery({ search, type: type === "all" ? undefined : type, page, limit });
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ altText: "", title: "" });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadMedia(formData).unwrap();
      toast.success("Media uploaded successfully");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      toast.error(error?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      await deleteMedia(id).unwrap();
      toast.success("Media deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const openEditModal = (media: any) => {
    setSelectedMedia(media);
    setEditForm({ altText: media.altText || "", title: media.title || "" });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateMedia({ id: selectedMedia.id, data: editForm }).unwrap();
      toast.success("Media updated");
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Media Library"
        description="Manage all images, videos, and documents"
        icon={ImageIcon}
        action={
          <CanAccess permission="media:upload">
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Media"}
              </Button>
            </div>
          </CanAccess>
        }
      />

      <div className="grid gap-3 md:grid-cols-3 items-end">
        <div className="grid gap-2 md:col-span-2">
          <Label>Search</Label>
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search file name" />
        </div>
        <div className="grid gap-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(value) => { setType(value); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {data?.media?.map((m: any) => (
            <div key={m.id} className="group relative rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {m.type === "image" ? (
                  <img
                    src={m.thumbnailUrl || m.publicUrl}
                    alt={m.altText || m.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-xs break-all">{m.fileName}</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                <CanAccess permission="media:write">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(m)} className="h-8 w-8 p-0 rounded-full">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </CanAccess>
                <CanAccess permission="media:delete">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(m.id)} className="h-8 w-8 p-0 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CanAccess>
              </div>
              <div className="p-2 text-xs truncate bg-background border-t">
                {m.title || m.fileName}
              </div>
            </div>
          ))}
          {data?.media?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
              No media found. Upload some files to get started.
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Image Title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={editForm.altText}
                onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                placeholder="Alt Text (for SEO)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
