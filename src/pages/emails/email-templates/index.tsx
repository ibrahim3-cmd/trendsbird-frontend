import { useMemo, useState } from "react";
import {  PlusCircle, Settings, Eye, Pencil, Trash2, ListFilter, Globe, Mail, AlertTriangle } from "lucide-react";
//import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
import {
	useGetTemplatesQuery,
	useDeleteTemplateMutation,
	useGetTemplateCategoriesQuery,
} from "@/redux/features/emailTemplate/emailTemplateApiSlice";
import { IEmailTemplate, ITemplateCategory } from "@/types/emailTemplate.type";
import { ApiError } from "@/types/api.type.error";
import { toast } from "sonner";
import CreateTemplateModal from "./components/CreateTemplateModal";
import UpdateTemplateModal from "./components/UpdateTemplateModal";
import PreviewTemplateModal from "./components/PreviewTemplateModal";
import ManageCategoryModal from "./components/ManageCategoryModal";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function EmailTemplateManagement() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const isSuperAdmin = userInfo?.data?.role === role.superAdmin;
  console.log(isSuperAdmin);
	const navigate = useNavigate();
	const [query, setQuery] = useState({
		page: 1,
		limit: 10,
		searchTerm: "",
		category: "",
	});

	const { data: userData } = useUserInfoQuery(undefined);
	console.log(userData?.data?.org?.emailConfiguration?.smtpConfig?.auth?.user);
	const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);

	const { data: categoriesRes } = useGetTemplateCategoriesQuery(null);
	const categories: ITemplateCategory[] = categoriesRes?.data || [];

	const { data: templatesRes, isLoading, error } = useGetTemplatesQuery({
		page: query.page,
		limit: query.limit,
		searchTerm: query.searchTerm || undefined,
		category: query.category || undefined,
	});

	const meta = templatesRes?.meta;

	// Filter templates based on user role
	const filteredTemplates = useMemo(() => {
		const templates: IEmailTemplate[] = templatesRes?.data || [];
		if (userData?.data?.role === "SUPER_ADMIN") {
			return templates; // Show all templates including global ones
		}
		// For other roles, only show org-specific templates
		return templates.filter(t => t.org);
	}, [templatesRes?.data, userData?.data?.role]);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editing, setEditing] = useState<IEmailTemplate | null>(null);
	const [previewing, setPreviewing] = useState<IEmailTemplate | null>(null);
	const [categoryModalOpen, setCategoryModalOpen] = useState(false);
	const [deleteState, setDeleteState] = useState<{ isOpen: boolean; template: IEmailTemplate | null }>({
		isOpen: false,
		template: null,
	});

	const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();

	const totalPages = useMemo(() => (meta?.total && meta?.limit ? Math.ceil(meta.total / meta.limit) : 1), [meta]);

	const handleNewTemplateClick = () => {
		// Check if user is SUPER_ADMIN
		if (userData?.data?.role === "SUPER_ADMIN") {
			setIsCreateOpen(true);
			return;
		}

		// Check if email is configured
		const verifiedSender = userData?.data?.org?.emailConfiguration?.sendgridConfig?.verifiedSender || userData?.data?.org?.emailConfiguration?.smtpConfig?.auth?.user;
		if (!verifiedSender) {
			setShowEmailConfigModal(true);
		} else {
			setIsCreateOpen(true);
		}
	};

	const handleDelete = async () => {
		if (!deleteState.template) return;
		try {
			await deleteTemplate(deleteState.template._id).unwrap();
			toast.success("Template deleted successfully");
		} catch (e) {
			const msg = (e as ApiError)?.data?.message || "Failed to delete template";
			toast.error(msg);
		} finally {
			setDeleteState({ isOpen: false, template: null });
		}
	};

	const handleEditClick = (template: IEmailTemplate) => {
		setEditing(template);
	};

	const renderCategoryName = (cat: IEmailTemplate["category"]) => {
		if (!cat) return <span className="text-muted-foreground">—</span>;
		if (typeof cat === "string") {
			const found = categories.find((c) => c._id === cat);
			return found ? found.name : "Unknown";
		}
		return (cat as ITemplateCategory)?.name || "—";
	};

	return (
		<>
			{/* <PageHeader
				title="Email Templates"
				description="Create, organize, and manage email templates for your organization."
				icon={Mail}
			/> */}

			<Card>
				<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between overflow-auto pb-4">
					<CardTitle className="text-base">Templates</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
						<div className="flex items-center gap-2">
							<ListFilter className="size-4 text-muted-foreground" />
							<Label htmlFor="search" className="sr-only">Search</Label>
							<Input
								id="search"
								placeholder="Search by title or subject..."
								value={query.searchTerm}
								onChange={(e) => setQuery((q) => ({ ...q, page: 1, searchTerm: e.target.value }))}
								className="w-full sm:w-[220px]"
							/>
						</div>
						{/* Type filter removed to align with backend */}
									<Select
										value={query.category && query.category.length > 0 ? query.category : "all"}
										onValueChange={(v) =>
											setQuery((q) => ({ ...q, page: 1, category: v === "all" ? "" : v }))
										}
									>
							<SelectTrigger className="w-full sm:w-[200px]">
								<SelectValue placeholder="All categories" />
							</SelectTrigger>
							<SelectContent>
											<SelectItem value="all">All categories</SelectItem>
								{categories.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Org filter removed */}
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setCategoryModalOpen(true)}>
									<Settings className="size-4 mr-1" /> Manage Categories
								</Button>
							<Button onClick={handleNewTemplateClick}>
									<PlusCircle className="size-4 mr-1" /> New Template
								</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Subject</TableHead>
									<TableHead className="hidden sm:table-cell">Category</TableHead>
									<TableHead className="hidden sm:table-cell">Scope</TableHead>
									<TableHead className="hidden lg:table-cell">Updated</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									[...Array(5)].map((_, idx) => (
										<TableRow key={`skeleton-${idx}`}>
											<TableCell colSpan={6}>
												<div className="h-4 w-full animate-pulse bg-muted rounded" />
											</TableCell>
										</TableRow>
									))
								) : error ? (
									<TableRow>
										<TableCell colSpan={6}>
											<div className="text-red-600">Failed to load templates</div>
										</TableCell>
									</TableRow>
								) : filteredTemplates.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6}>
											<div className="text-muted-foreground">No templates found.</div>
										</TableCell>
									</TableRow>
								) : (
									filteredTemplates.map((t) => (
										<TableRow key={t._id}>
											<TableCell className="font-medium">{t.title}</TableCell>
											<TableCell className="max-w-[360px] truncate">{t.subject}</TableCell>
											<TableCell className="hidden sm:table-cell">{renderCategoryName(t.category)}</TableCell>
											<TableCell className="hidden sm:table-cell">
												{!t.org ? (
													<Badge variant="secondary" className="inline-flex items-center gap-1">
														<Globe className="size-3" /> Global
													</Badge>
												) : (
													<span className="text-xs text-muted-foreground">Org-specific</span>
												)}
											</TableCell>
											{/* Type column removed */}
											<TableCell className="hidden lg:table-cell">
												{t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "—"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button variant="outline" size="sm" onClick={() => setPreviewing(t)}>
															<Eye className="size-4" />
														</Button>

													<Button
															variant="outline"
															size="sm"
															onClick={() => handleEditClick(t)}
														>
															<Pencil className="size-4" />
														</Button>


													<Button
															variant="destructive"
															size="sm"
															onClick={() => setDeleteState({ isOpen: true, template: t })}
														// disabled={userData?.data?.role !== "SUPER_ADMIN"}
														>
															<Trash2 className="size-4" />
														</Button>

												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4">
							<div className="text-sm text-muted-foreground">
								Page {meta?.page || 1} of {totalPages}
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={(meta?.page || 1) <= 1}
									onClick={() => setQuery((q) => ({ ...q, page: (meta?.page || 1) - 1 }))}
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={(meta?.page || 1) >= totalPages}
									onClick={() => setQuery((q) => ({ ...q, page: (meta?.page || 1) + 1 }))}
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Modals */}
			<CreateTemplateModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				categories={categories}
			/>

			<UpdateTemplateModal
				isOpen={!!editing}
				onClose={() => setEditing(null)}
				template={editing}
				categories={categories}
			/>

			<PreviewTemplateModal
				isOpen={!!previewing}
				onClose={() => setPreviewing(null)}
				template={previewing}
			/>

			<ManageCategoryModal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />

			{/* Email Configuration Required Modal */}
			<Dialog open={showEmailConfigModal} onOpenChange={setShowEmailConfigModal}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-orange-600">
							<AlertTriangle className="h-5 w-5" />
							Email Configuration Required
						</DialogTitle>
						<DialogDescription className="pt-4">
							<div className="flex flex-col gap-4">
								<div className="flex items-start gap-3">
									<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div className="space-y-2">
										<p className="text-sm text-foreground">
											To use email templates, you need to configure your email service first. 
											Please set up a verified sender email address in your email service settings.
										</p>
										<p className="text-sm text-muted-foreground">
											This is required to send emails from your organization.
										</p>
									</div>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2 mt-4">
						{/* <Button
							variant="outline"
							onClick={() => setShowEmailConfigModal(false)}
						>
							Later
						</Button> */}
						<Button
							onClick={() => {
								setShowEmailConfigModal(false);
								navigate("/settings?tab=email-services");
							}}
						>
							Configure Email Service
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<DeleteConfirmationModal
				isOpen={deleteState.isOpen}
				onClose={() => setDeleteState({ isOpen: false, template: null })}
				onConfirm={handleDelete}
				title="Delete Template"
				itemName={deleteState.template?.title || ""}
				description={`This will permanently delete the template "${deleteState.template?.title || ""}".`}
				isLoading={isDeleting}
			/>
		</>
	);
}
