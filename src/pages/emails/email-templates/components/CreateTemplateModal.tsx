import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Save, Send } from "lucide-react";
import { ITemplateCategory } from "@/types/emailTemplate.type";
import { useCreateTemplateMutation } from "@/redux/features/emailTemplate/emailTemplateApiSlice";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllOrgQuery } from "@/redux/features/org/orgApiSlice";
import { toast } from "sonner";
import { createEmailTemplateSchema } from "@/validations/emailTemplate.schema";
import { ApiError } from "@/types/api.type.error";
import { useSendEmailMutation } from "@/redux/features/emailLog/emailLogApiSlice";
import EmailBuilderEditor, { EmailBuilderEditorRef } from "@/components/ui/EmailBuilderEditor";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	categories: ITemplateCategory[];
}

export default function CreateTemplateModal({ isOpen, onClose, categories }: Props) {
	const emailEditorRef = useRef<EmailBuilderEditorRef>(null);
	const [form, setForm] = useState({
		title: "",
		subject: "",
		category: "",
		des: "",
	});

	// Super admin targeting: leave global true to create a global template; else set target org id
	const [isGlobal, setIsGlobal] = useState<boolean>(true);
	console.log("isGlobal:", isGlobal);
	const [targetOrgId, setTargetOrgId] = useState<string>("");
	const [selectedOrgName, setSelectedOrgName] = useState<string>("All Organization (Global)");
	console.log("Selected Org Name:", selectedOrgName);
	const [hasEditorContent, setHasEditorContent] = useState<boolean>(false);

	const { data: userData } = useUserInfoQuery(undefined);
	const isSuperAdmin = userData?.data?.role === "SUPER_ADMIN";
	const { data: allOrgs } = useGetAllOrgQuery({
		page: 1,
		limit: 1000,
	}, { skip: !isSuperAdmin });

	const [createTemplate, { isLoading }] = useCreateTemplateMutation();
	const [sendEmail, { isLoading: isSendingTest }] = useSendEmailMutation();
	const [showTestEmailModal, setShowTestEmailModal] = useState(false);
	const [testEmailAddress, setTestEmailAddress] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setForm({ title: "", subject: "", category: "", des: "" });
			setIsGlobal(true);
			setTargetOrgId("");
			setSelectedOrgName("All Organization (Global)");
			setShowTestEmailModal(false);
			setTestEmailAddress("");
			setHasEditorContent(false);
		}
	}, [isOpen]);

	const handleSave = async () => {
		try {
			// Export HTML and design JSON from the email builder
			const { html, designJson } = await emailEditorRef.current!.exportHtml();

			if (!html || html.trim() === "") {
				toast.error("Email body content is required");
				return;
			}

			// Validate with zod schema before sending
			const toValidate = {
				title: form.title,
				subject: form.subject,
				body: html,
				designJson: JSON.stringify(designJson),
				des: form.des,
				category: form.category || undefined,
			};

			const result = createEmailTemplateSchema.safeParse(toValidate);
			if (!result.success) {
				const firstError = Object.values(result.error.flatten().fieldErrors).flat(1)[0];
				toast.error(typeof firstError === "string" ? firstError : "Please fix the form errors");
				return;
			}

			// Super admin: if global -> send { org: "" }; if specific -> { org: orgId }
			const payload: any = {
				title: form.title,
				subject: form.subject,
				category: form.category || undefined,
				des: form.des || undefined,
				body: html,
				designJson: JSON.stringify(designJson),
			};
			if (isSuperAdmin) {
				if (targetOrgId === "ALL" || !targetOrgId) {
					payload.org = null;
				} else if (targetOrgId.trim()) {
					payload.org = targetOrgId.trim();
				}
			}
			await createTemplate(payload).unwrap();
			toast.success("Template created successfully");
			onClose();
		} catch (e) {
			const msg = (e as ApiError)?.data?.message || "Failed to create template";
			toast.error(msg);
		}
	};

	// Validation: title, subject, category, and editor content required
	const isValid = form?.title?.trim() && form?.subject?.trim() && form?.category?.trim() && hasEditorContent;

	// For test email: subject and editor content required
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
			// Export HTML from the email builder
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
					<DialogHeader className="flex flex-row items-center justify-between pl-8 pr-5 py-2 border-b bg-gradient-to-r from-gray-50 to-white">
						<DialogTitle className="text-popover-foreground font-sans">Create New Template</DialogTitle>
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
								{isLoading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />} Create Template
							</Button>
						</div>
					</DialogHeader>

					<div className="flex flex-1 ">
						{/* Left side - Input fields (25% width) */}
					<div className="w-[25%] border-r border-border m-2 p-4 flex flex-col min-h-0">
						<div className="space-y-4 overflow-y-auto flex-1">
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
										<Label>Organization</Label>
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
								ref={emailEditorRef}
								minHeight="83vh"
								onChange={() => setHasEditorContent(true)}
							/>
						</div>
					</div>
					{/* <DialogFooter className="px-6 py-4 border-t border-border bg-popover">
						
					</DialogFooter> */}
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
