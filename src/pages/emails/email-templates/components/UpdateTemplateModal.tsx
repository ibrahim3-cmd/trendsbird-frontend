import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Save, Send } from "lucide-react";
import { IEmailTemplate, ITemplateCategory } from "@/types/emailTemplate.type";
import { useUpdateTemplateMutation } from "@/redux/features/emailTemplate/emailTemplateApiSlice";
import { useSendEmailMutation } from "@/redux/features/emailLog/emailLogApiSlice";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { toast } from "sonner";
import { updateEmailTemplateSchema } from "@/validations/emailTemplate.schema";
import { ApiError } from "@/types/api.type.error";
import EmailBuilderEditor, { EmailBuilderEditorRef } from "@/components/ui/EmailBuilderEditor";
// Test-send now uses the template-specific endpoint

interface Props {
	isOpen: boolean;
	onClose: () => void;
	template: IEmailTemplate | null;
	categories: ITemplateCategory[];
}

export default function UpdateTemplateModal({ isOpen, onClose, template, categories }: Props) {
	const emailEditorRef = useRef<EmailBuilderEditorRef>(null);
	const [form, setForm] = useState({
		title: "",
		subject: "",
		category: "",
		des: "",
	});

	// Ownership controls
	const [isGlobal, setIsGlobal] = useState<boolean>(false);
	console.log("isGlobal:", isGlobal);
	const [targetOrgId, setTargetOrgId] = useState<string>("");
	const [hasEditorContent, setHasEditorContent] = useState<boolean>(false);

	const { data: userData } = useUserInfoQuery(undefined);
	const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";
	const { data: allOrgs } = useGetAllOrgQuery({
		page: 1,
		limit: 1000,
	}, { skip: !isSuperAdmin });

	const [updateTemplate, { isLoading }] = useUpdateTemplateMutation();
	const [sendEmail, { isLoading: isSendingTest }] = useSendEmailMutation();
	const [showTestEmailModal, setShowTestEmailModal] = useState(false);
	const [testEmailAddress, setTestEmailAddress] = useState("");

	useEffect(() => {
		console.log(template);
		if (template) {
			console.log('UpdateTemplateModal - template loaded:', {
				id: template._id,
				title: template.title,
				hasDesignJson: !!template.designJson,
				designJsonLength: template.designJson?.length,
				designJsonPreview: template.designJson?.substring(0, 100)
			});
			setForm({
				title: template.title,
				subject: template.subject,
				category: typeof template.category === "string" ? template.category : (template.category?._id as string) || "",
				des: template.des || "",
			});
			// If template has no org, it's global
			setIsGlobal(!template.org);
			// Set the org ID if template has one, otherwise set to "ALL"
			if (template.org) {
				const orgId = template?.org || null;
				if(orgId){
					setTargetOrgId(orgId);
				}
			} else {
				setTargetOrgId("ALL");
			}
			// Template has content since it's loaded from existing data
			setHasEditorContent(!!template.designJson || !!template.body);
		}
	}, [template]);

	useEffect(() => {
		if (!isOpen) {
			setShowTestEmailModal(false);
			setTestEmailAddress("");
		}
	}, [isOpen]);

	const handleSave = async () => {
		if (!template) return;
		
		try {
			// Export HTML and design JSON from the email builder
			const { html, designJson } = await emailEditorRef.current!.exportHtml();

			if (!html || html.trim() === "") {
				toast.error("Email body content is required");
				return;
			}

			// Validate using update schema
			const toValidate: any = {
				title: form.title,
				subject: form.subject,
				body: html,
				designJson: JSON.stringify(designJson),
				des: form.des,
				category: form.category || undefined,
			};

			const result = updateEmailTemplateSchema.safeParse(toValidate);
			if (!result.success) {
				const firstError = Object.values(result.error.flatten().fieldErrors).flat(1)[0];
				toast.error(typeof firstError === "string" ? firstError : "Please fix the form errors");
				return;
			}

			const payload: any = {
				id: template._id,
				title: form.title,
				subject: form.subject,
				category: form.category || undefined,
				des: form.des || undefined,
				body: html,
				designJson: JSON.stringify(designJson),
			};
			// Super admin may reassign ownership
			if (isSuperAdmin) {
				if (targetOrgId === "ALL" || !targetOrgId) {
					payload.org = null;
				} else if (targetOrgId.trim()) {
					payload.org = targetOrgId.trim();
				}
			}
			await updateTemplate(payload).unwrap();
			toast.success("Template updated successfully");
			onClose();
		} catch (e) {
			const msg = (e as ApiError)?.data?.message || "Failed to update template";
			toast.error(msg);
		}
	};

	// Validation: title, subject, category, and editor content required
	const isValid = form?.title?.trim() && form?.category?.trim() && hasEditorContent;



	// For test email: subject and editor content required (exports current content)
	const canSendTest = form?.subject?.trim() && hasEditorContent;

	const handleSendTestEmail = async () => {
		const email = testEmailAddress.trim();
		if (!email) {
			toast.error("Please enter an email address");
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}
		if (!form.subject.trim()) {
			toast.error("Email subject is required");
			return;
		}

		try {
			// Export current HTML from the email builder (not the saved template)
			const { html } = await emailEditorRef.current!.exportHtml();

			if (!html || html.trim() === "") {
				toast.error("Email body content is required");
				return;
			}

			await sendEmail({ to: [email], subject: form.subject, htmlContent: html }).unwrap();
			toast.success("Test email sent successfully!");
			setShowTestEmailModal(false);
			setTestEmailAddress("");
		} catch (e) {
			toast.error("Failed to send email. Please try again.");
		}
	};

	return (
		<>
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[95vw] !max-w-[1750px] h-[96vh] p-0 overflow-hidden flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-popover text-popover-foreground">
				{/* Header - align with CreateTemplateModal */}
				<DialogHeader className="flex flex-row items-center justify-between pl-8 pr-5 py-2 border-b bg-gradient-to-r from-gray-50 to-white">
					<DialogTitle className="text-popover-foreground font-sans">Update Template</DialogTitle>
					<div className="flex items-center pr-10 gap-2 justify-end">
						<Button size={"sm"} variant="outline" onClick={onClose} disabled={isLoading}>
							Cancel
						</Button>
						<Button
							variant="default"
							size={"sm"}
							onClick={() => setShowTestEmailModal(true)}
							disabled={!canSendTest}
							className="bg-primary text-primary-foreground hover:opacity-90"
						>
							<Send className="mr-2 h-4 w-4" /> Send Test Email
						</Button>

						<Button size={"sm"} onClick={handleSave} disabled={!isValid || isLoading}>
							{isLoading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />} Update Template
						</Button>
					</div>
				</DialogHeader>

				<div className="flex flex-1 overflow-hidden">
					{/* Left side - Input fields (25% width) */}
					<div className="w-[25%] border-r border-border m-2 p-4 flex flex-col">
						<div className="space-y-4 overflow-auto">
							<div className="space-y-2">
								<Label htmlFor="title">Title *</Label>
								<Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="subject">Subject *</Label>
								<Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
							</div>

							<div className="space-y-2">
								<Label>Category *</Label>
								<Select
									value={form.category && form.category.length > 0 ? form.category : "none"}
									onValueChange={(v) => setForm({ ...form, category: v === "none" ? "" : v })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category (optional)" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										{categories.map((c) => (
											<SelectItem key={c._id} value={c._id}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						{isSuperAdmin && (
							<div className="space-y-2">
								<Label htmlFor="org">Organization</Label>
								<select
									id="org"
									className="w-full h-9 border rounded-md px-3 bg-background"
									value={targetOrgId}
									onChange={(e) => setTargetOrgId(e.target.value)}
								>
									<option value="ALL">All Organization (Global)</option>
									{Array.isArray(allOrgs?.data) && allOrgs?.data?.map((org: { _id: string; orgName: string }) => (
										<option key={org._id} value={org._id}>
											{org.orgName}
										</option>
									))}
								</select>
							</div>
						)}
							<div className="space-y-2">
								<Label htmlFor="des">Description</Label>
								<Textarea
									id="des"
									value={form.des}
									onChange={(e) => setForm({ ...form, des: e.target.value })}
									rows={4}
								/>
							</div>
						</div>
					</div>

					{/* Right side - Email Builder (75% width) */}
					<div className="flex-1 overflow-auto px-5">
						<EmailBuilderEditor
							key={template?._id}
							ref={emailEditorRef}
							designJson={template?.designJson}
							minHeight="83vh"
							onChange={() => setHasEditorContent(true)}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>

		{/* Test Email Modal */}
		<Dialog open={showTestEmailModal} onOpenChange={setShowTestEmailModal}>
			<DialogContent className="sm:max-w-[480px] bg-popover border-border">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Mail className="h-5 w-5 text-primary" />
							<DialogTitle className="text-popover-foreground font-sans">Send Test Email</DialogTitle>
						</div>
					</div>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="testEmail">Send to Email Address</Label>
						<Input
							id="testEmail"
							type="email"
							placeholder="Enter email address"
							value={testEmailAddress}
							onChange={(e) => setTestEmailAddress(e.target.value)}
						/>
					</div>

					<div className="rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
						<p>
							<strong>Subject:</strong> {form.subject || "No subject"}
						</p>
						<p>
							<strong>Template:</strong> {form.title || "Untitled Template"}
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setShowTestEmailModal(false)} disabled={isSendingTest}>
						Cancel
					</Button>
					<Button onClick={handleSendTestEmail} disabled={isSendingTest}>
						{isSendingTest && <Loader2 className="size-4 mr-2 animate-spin" />}
						<Send className="mr-2 h-4 w-4" /> Send Test Email
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		</>
	);
}
