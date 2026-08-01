import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMediaQuery } from "@/redux/features/media/media.api";
import { Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: any[]) => void;
  multiple?: boolean;
}

export function MediaPicker({ open, onOpenChange, onSelect, multiple = false }: MediaPickerProps) {
  const { data, isLoading } = useGetMediaQuery({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (multiple) {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setSelectedIds([id]);
    }
  };

  const handleConfirm = () => {
    const selectedMedia = data?.data?.media?.filter((m: any) => selectedIds.includes(m.id)) || [];
    onSelect(selectedMedia);
    onOpenChange(false);
    setSelectedIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {data?.data?.media?.map((m: any) => {
                const isSelected = selectedIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleSelect(m.id)}
                    className={cn(
                      "group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary",
                      isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
                    )}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.thumbnailUrl || m.publicUrl}
                        alt={m.altText || m.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center p-2 text-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
              {data?.data?.media?.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No media found. Go to Media Library to upload.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={selectedIds.length === 0}>
            Confirm Selection {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
