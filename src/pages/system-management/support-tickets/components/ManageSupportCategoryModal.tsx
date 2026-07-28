import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateSupportCategoryMutation,
  useUpdateSupportCategoryMutation,
  useDeleteSupportCategoryMutation,
} from "@/redux/features/support/supportApiSlice";
import {
  Loader2,
  Plus,
  Settings,
  Tag,
  Trash2,
  XCircle,
  Pencil,
  Save,
  X,
  AlertCircle,
  Palette,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

// --------------------- Types ---------------------
interface CategoryType {
  _id: string;
  name: string;
  color: string;
  description?: string;
}

interface ManageCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryType[];
  onRefetch: () => void;
  onDeleteCategory?: (categoryId: string) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export const ManageSupportCategoryModal: React.FC<ManageCategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRefetch,
}) => {
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [createCategory, { isLoading: isCreating }] =
    useCreateSupportCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateSupportCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteSupportCategoryMutation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
    },
  });

  const colorValue = watch("color");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    reset({
      name: "",
      description: "",
      color: "#3B82F6",
    });
    setEditingCategory(null);
    setShowDeleteConfirm(null);
    setShowAddForm(false);
  };

  //     const onSubmit = async (data: CategoryFormData) => {

  //     try {
  //       if (editingCategory) {
  //         // Update existing category
  //         await updateCategory({
  //           id: editingCategory._id,
  //           name: data.name.trim(),
  //           description: data.description.trim(),
  //           color: data.color,
  //         }).unwrap();
  //         toast.success("Category updated successfully!");
  //       } else {
  //         // Create new category
  //         await createCategory({
  //           name: data.name.trim(),
  //           description: data.description.trim(),
  //           color: data.color,
  //         }).unwrap();
  //         toast.success("Category created successfully!");
  //       }

  //       resetForm();
  //       onRefetch();
  //     } catch (error) {
  //         console.log(error)
  //       const err = error as { data?: { message?: string } };
  //       toast.error(err?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
  //     }
  //   };

  const onSubmit = async (data: CategoryFormData) => {
    console.log(data);
    try {
      const payload: any = {
        name: data.name.trim(),
        color: data.color,
      };

      if (data.description?.trim()) {
        payload.description = data.description.trim();
      }

      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          ...payload,
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        console.log("pay = ", payload);
        await createCategory({ data: payload }).unwrap();
        toast.success("Category created successfully!");
      }

      resetForm();
      onRefetch();
    } catch (error) {
      console.log(error);
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success("Category deleted successfully!");
      setShowDeleteConfirm(null);
      onRefetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  const startEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setValue("color", category.color || "#3B82F6");
    setShowAddForm(false);
    setShowDeleteConfirm(null);

    // Smooth scroll after render
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingCategory(null);
    reset({
      name: "",
      description: "",
      color: "#3B82F6",
    });
  };

  const cancelEdit = () => {
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Manage Support Categories
                </h2>
                <p className="text-sm text-gray-600">
                  Create, edit, and organize your support ticket categories
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Add New Category Button */}
            {!showAddForm && !editingCategory && (
              <div className="mb-6">
                <Button onClick={startAdd} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Category
                </Button>
              </div>
            )}

            {/* Add/Edit Form */}
            {(showAddForm || editingCategory) && (
              <div
                ref={formRef}
                className="mb-6 p-6 border-2 border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 to-transparent"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {editingCategory ? (
                      <>
                        <Pencil className="h-5 w-5 text-primary" />
                        Edit Category
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-primary" />
                        Add New Category
                      </>
                    )}
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Category Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        {...register("name", {
                          required: "Category name is required",
                          minLength: {
                            value: 2,
                            message:
                              "Category name must be at least 2 characters",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "Category name must not exceed 50 characters",
                          },
                        })}
                        placeholder="e.g., Technical Support"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Palette className="h-4 w-4 inline mr-1" />
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          {...register("color", {
                            required: "Color is required",
                          })}
                          className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={colorValue}
                          onChange={(e) => setValue("color", e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1 font-mono text-sm uppercase"
                          maxLength={7}
                        />
                      </div>
                      {errors.color && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.color.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register("description", {
                        maxLength: {
                          value: 200,
                          message: "Description must not exceed 200 characters",
                        },
                      })}
                      placeholder="Brief description of this category..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isCreating || isUpdating || !isValid}
                      className="flex items-center gap-2"
                    >
                      {isCreating || isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {editingCategory
                        ? isUpdating
                          ? "Updating..."
                          : "Update Category"
                        : isCreating
                        ? "Creating..."
                        : "Create Category"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Existing Categories ({categories.length})
                </h3>
              </div>

              {/* Empty State */}
              {categories.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Tag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 font-medium mb-1">
                    No categories created yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Create your first category to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="relative bg-white border-2 border-gray-200 rounded-lg p-4
             h-[140px] flex flex-col justify-between
             hover:shadow-md hover:border-primary/30 transition-all duration-200"
                    >
                      {/* Category Info */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-gray-200"
                            style={{ backgroundColor: category.color }}
                          />
                          <h4 className="font-semibold text-gray-900 truncate">
                            {category.name}
                          </h4>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(category._id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>

                      {/* Delete Confirmation Overlay */}
                      {showDeleteConfirm === category._id && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center border-2 border-red-200">
                          <AlertCircle className="h-10 w-10 text-red-600 mb-3" />
                          <p className="text-sm font-semibold text-center text-gray-900 mb-1">
                            Delete Category?
                          </p>
                          <p className="text-xs text-center text-gray-600 mb-4">
                            "{category.name}" will be removed
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(category._id)}
                              disabled={isDeleting}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1.5 text-xs font-medium border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"} total
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
