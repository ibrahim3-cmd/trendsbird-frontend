import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IEmailTemplate } from "@/types/emailTemplate.type";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	template: IEmailTemplate | null;
}

export default function PreviewTemplateModal({ isOpen, onClose, template }: Props) {
	const subject = template?.subject || "";
	const body = template?.body || "";
	const placeholders = template?.placeholders || [];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:w-[55vw] w-[95vw] !max-w-[1600px] h-[90vh] !p-0 flex flex-col rounded-2xl shadow-2xl border border-border text-popover-foreground">
				<DialogHeader className="flex flex-row items-center justify-between px-6 py-5 border-b">
					<DialogTitle className="text-popover-foreground font-sans">Preview: {template?.title || "Template"}</DialogTitle>
				</DialogHeader>
				{/* Scrollable body */}
				<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
					<div className="space-y-1">
						<div className="text-sm text-muted-foreground">Subject</div>
						<div className="text-foreground font-medium break-words">{subject}</div>
					</div>
					{placeholders.length > 0 && (
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">Placeholders</div>
							<div className="flex flex-wrap gap-2">
								{placeholders.map((p) => (
									<span key={p} className="text-xs px-2 py-1 rounded">{'{{'}{p}{'}}'}</span>
								))}
							</div>
						</div>
					)}
					<div className="border rounded-md p-4">
						<div
							className="prose max-w-none dark:prose-invert"
							// Email HTML preview
							dangerouslySetInnerHTML={{ __html: body }}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
