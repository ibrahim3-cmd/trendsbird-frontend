import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Save, AlertCircle, RefreshCw } from "lucide-react";
import { createTemplateCategorySchema, updateTemplateCategorySchema } from "@/validations/emailTemplate.schema";
import {
	useCreateTemplateCategoryMutation,
	useDeleteTemplateCategoryMutation,
	useGetTemplateCategoriesQuery,
	useUpdateTemplateCategoryMutation,
} from "@/redux/features/emailTemplate/emailTemplateApiSlice";
import { ITemplateCategory } from "@/types/emailTemplate.type";
import { toast } from "sonner";
import { ApiError } from "@/types/api.type.error";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export default function ManageCategoryModal({ isOpen, onClose }: Props) {
	const { data: userInfo } = useUserInfoQuery(undefined);
	const isSuperAdmin = userInfo?.data?.role === role.superAdmin;

	const { data, isLoading, error, refetch } = useGetTemplateCategoriesQuery(null);
	const categories = useMemo(() => data?.data || [], [data]);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [editingCategory, setEditingCategory] = useState<ITemplateCategory | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);

	const [createCategory, { isLoading: isCreating }] = useCreateTemplateCategoryMutation();
	const [deleteCategory, { isLoading: isDeleting }] = useDeleteTemplateCategoryMutation();
	const [updateCategory, { isLoading: isUpdating }] = useUpdateTemplateCategoryMutation();

	useEffect(() => {
		if (!isOpen) {
			setName("");
			setDescription("");
			setEditingCategory(null);
			setShowDeleteConfirm(null);
			setShowAddForm(false);
		}
	}, [isOpen]);

	const startAdd = () => {
		setShowAddForm(true);
		setEditingCategory(null);
		setName("");
		setDescription("");
	};

	const startEdit = (category: ITemplateCategory) => {
		setEditingCategory(category);
		setName(category.name);
		setDescription((category as any).description || "");
		setShowAddForm(false);
	};

	const cancelEdit = () => {
		setEditingCategory(null);
		setName("");
		setDescription("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate create payload using zod schema
		const payload = { name: name.trim(), description: description.trim() };
		const parsed = createTemplateCategorySchema.safeParse(payload);
		if (!parsed.success) {
			const firstError = Object.values(parsed.error.flatten().fieldErrors).flat(1)[0];
			toast.error(typeof firstError === "string" ? firstError : "Please fix the form errors");
			return;
		}

		try {
			await createCategory({ name: name.trim(), description: description.trim() }).unwrap();
			toast.success("Category created successfully!");
			setName("");
			setDescription("");
			setShowAddForm(false);
			refetch();
		} catch (err) {
			const msg = (err as ApiError)?.data?.message || "Failed to create category";
			toast.error(msg);
		}
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate update payload using zod schema
		const payload = { name: name.trim(), description: description.trim() };
		const parsed = updateTemplateCategorySchema.safeParse(payload);
		if (!parsed.success) {
			const firstError = Object.values(parsed.error.flatten().fieldErrors).flat(1)[0];
			toast.error(typeof firstError === "string" ? firstError : "Please fix the form errors");
			return;
		}

		try {
			if (!editingCategory) return;
			await updateCategory({ id: editingCategory._id, name: name.trim(), description: description.trim() }).unwrap();
			toast.success("Category updated successfully!");
			setEditingCategory(null);
			setName("");
			setDescription("");
			refetch();
		} catch (err) {
			const msg = (err as ApiError)?.data?.message || "Failed to update category";
			toast.error(msg);
		}
	};

	const handleDelete = async (categoryId: string) => {
		try {
			await deleteCategory(categoryId).unwrap();
			toast.success("Category deleted successfully!");
			setShowDeleteConfirm(null);
			refetch();
		} catch (err) {
			const msg = (err as ApiError)?.data?.message || "Failed to delete category";
			toast.error(msg);
		}
	};

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:w-[55vw] w-[95vw] !max-w-[1600px] h-[90vh] !p-0 flex flex-col rounded-2xl shadow-2xl border border-border bg-popover text-popover-foreground mb-5">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border">
					<h2 className="text-xl font-semibold text-foreground">Manage Categories</h2>
				</div>

				{/* Content */}
				<div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
					{/* Add New Category Button */}
					<div className="mb-6">
						<Button onClick={startAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
							<Plus className="h-4 w-4 mr-2" /> Add New Category
						</Button>
					</div>
					{/* Add/Edit Form */}
					{(showAddForm || editingCategory) && (
						<div className="mb-6 p-4 border border-border rounded-lg bg-popover/5">
							<h3 className="text-lg font-medium mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
							<form onSubmit={editingCategory ? handleUpdate : handleSubmit}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div className="space-y-2">
										<Label className="text-foreground">Category Name *</Label>
										<Input
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Enter category name"
											className="bg-background border-border"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-foreground">Description</Label>
										<Input
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Enter category description"
											className="bg-background border-border"
										/>
									</div>
								</div>
								<div className="flex gap-2 flex-wrap">
									{editingCategory ? (
										<Button
											type="submit"
											disabled={isCreating || isUpdating}
											className="bg-primary text-primary-foreground hover:bg-primary/90"
										>
											<Save className="h-4 w-4 mr-2" />
											{isUpdating ? "Updating..." : "Update Category"}
										</Button>
									) : (
										<Button
											type="submit"
											disabled={isCreating || isUpdating}
											className="bg-primary text-primary-foreground hover:bg-primary/90"
										>
											<Save className="h-4 w-4 mr-2" />
											{isCreating ? "Creating..." : "Create Category"}
										</Button>
									)}
									<Button
										type="button"
										variant="outline"
										onClick={editingCategory ? cancelEdit : () => setShowAddForm(false)}
										className="border-border text-foreground hover:bg-muted min-w-[100px]"
									>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					)}

					{/* Categories List */}
					<div>
						<h3 className="text-lg font-medium mb-4">Existing Categories</h3>

						{/* {error && (
							<div className="flex items-center justify-center p-8 text-destructive">
								<AlertCircle className="h-5 w-5 mr-2" />
								<span>Failed to load categories</span>
							</div>
						)} */}

						{/* Empty State */}
						{!isLoading && !error && categories.length === 0 && (
							<div className="text-center p-8 text-muted-foreground">
								<AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
								<p>No categories found</p>
								<p className="text-sm">Create your first category to get started</p>
							</div>
						)}

						{/* Categories Grid */}
						{(!isLoading && !error && categories.length > 0) && (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
								{categories.map((category) => (
									<div
										key={category._id}
										className="relative bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 min-h-[200px] flex flex-col overflow-hidden h-full"
									>
										{/* Top: title and description */}
										<div className="flex-1 mb-4">
											<h4 className="font-semibold text-card-foreground mb-2 text-lg leading-tight">
												{category.name}
											</h4>
											{(category as any).description ? (
												<p className="text-sm text-muted-foreground line-clamp-3">
													{(category as any).description}
												</p>
											) : (
												<p className="text-sm text-muted-foreground italic">No description</p>
											)}
										</div>

										{/* Action buttons inside the card (bottom) */}
										<div className="pt-4 border-t border-border">
											<div className="flex items-center justify-between gap-2">
												{/* <div className="text-xs text-muted-foreground truncate">Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}</div> */}
												<div className="flex items-center gap-2 shrink-0">
													{(category.org || isSuperAdmin) && (
														<Button
															onClick={() => startEdit(category)}
															variant="outline"
															size="sm"
															className="px-3 py-1.5 border-border hover:bg-muted text-sm flex-none flex items-center justify-center gap-1"
														>
															<Pencil className="h-4 w-4 mr-1" />
															<span className="leading-none">Edit</span>
														</Button>
													)}
													{(category.org || isSuperAdmin) && (
														<Button
															onClick={() => setShowDeleteConfirm(category._id)}
															variant="outline"
															size="sm"
															className="px-3 py-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-sm flex-none flex items-center justify-center gap-1"
														>
															<Trash2 className="h-4 w-4 mr-1" />
															<span className="leading-none">Delete</span>
														</Button>
													)}
												</div>
											</div>
										</div>

										{/* Inline Delete Confirmation */}
										{showDeleteConfirm === category._id && (
											<div className="absolute inset-0 z-50 bg-background/98 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-lg border-2 border-destructive shadow-lg box-border">
												<AlertCircle className="h-12 w-12 text-destructive mb-3" />
												<p className="text-sm text-center mb-2 font-semibold text-foreground">
													Delete Category?
												</p>
												<p className="text-xs text-center mb-4 text-muted-foreground">
													"{category.name}" will be permanently removed.
												</p>
												<div className="flex gap-3 w-full">
													<Button
														onClick={() => setShowDeleteConfirm(null)}
														variant="outline"
														size="sm"
														className="flex-1 border-border"
													>
														Cancel
													</Button>
													<Button
														onClick={() => handleDelete(category._id)}
														size="sm"
														variant="destructive"
														disabled={isDeleting}
														className="flex-1"
													>
														{isDeleting ? "Deleting..." : "Delete"}
													</Button>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Footer
				<div className="flex justify-end p-6 border-t border-border">
					<Button onClick={onClose} variant="outline" className="border-border">Close</Button>
				</div> */}
			</DialogContent>

			{/* Full-screen loader overlay (matches pattern used in admin pages) */}
			{(isCreating || isUpdating || isDeleting || isLoading) && (
				<div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
						<div className="flex items-center gap-3">
							<RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
							<p className="text-gray-900 dark:text-gray-100">
								{isCreating ? "Creating category..." : isUpdating ? "Updating category..." : isDeleting ? "Deleting category..." : isLoading ? "Loading categories..." : "Working..."}
							</p>
						</div>
					</div>
				</div>
			)}
		</Dialog>
	);
}
