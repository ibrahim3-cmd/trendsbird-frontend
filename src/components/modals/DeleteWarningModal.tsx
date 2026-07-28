import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

export interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    subTitle?: string
    itemName: string
    description?: string
    isLoading?: boolean
    confirmText?: string
    confirmingText?: string
    confirmVariant?: React.ComponentProps<typeof Button>["variant"]
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    subTitle = "Are you sure you want to delete the",
    itemName,
    description,
    isLoading = false,
    confirmText = "Delete",
    confirmingText = "Deleting...",
    confirmVariant = "destructive"
}: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-popover border-border">
                <DialogHeader>
                    <DialogTitle className="text-popover-foreground  font-sans flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-foreground">
                        {subTitle} <strong>"{itemName}"</strong>?
                    </p>
                    {description && (
                       <p className="text-muted-foreground text-sm mt-2">{description}</p>
                    )}
                    {/* <p className="text-muted-foreground text-sm mt-2">{warningMessage}</p> */}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-border text-foreground hover:bg-muted bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        className={confirmVariant === "destructive" ? "bg-red-700 hover:bg-red-800" : undefined}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        <span className="font-semibold">{isLoading ? confirmingText : confirmText}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
