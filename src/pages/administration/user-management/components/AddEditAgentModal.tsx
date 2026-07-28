import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { IUser, StorageUnit } from "@/types";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateUserMutation } from "@/redux/features/user/user.api";

import formatPhoneNumber from "@/utils/formatPhoneNumber";

import z from "zod";
import { useCreateSupportAgentMutation } from "@/redux/features/auth/auth.api";
import { createSupportAgentZodSchema, updateSupportAgentZodSchema } from "@/validations/supportAgent.schema";

interface AddEditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdAgent?: IUser) => void;
  editAgent?: IUser | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  storageValue: string;
  storageUnit: StorageUnit;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  storageValue?: string;
  storageUnit?: string;
}

const AddEditAgentModal: React.FC<AddEditAgentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editAgent,
}) => {
  const [createSupportAgent, { isLoading: isCreating }] =
    useCreateSupportAgentMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    storageValue: "0",
    storageUnit: "MB",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [createAsVerified, setCreateAsVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = !!editAgent;

  // Load agent data when editing
  useEffect(() => {
    if (editAgent) {
      setFormData({
        name: editAgent.name || "",
        email: editAgent.email || "",
        phone: editAgent.phone || "",
        password: "", // Don't show existing password
        address: (editAgent as IUser & { address?: string }).address || "",
        storageValue: String(editAgent.storageUsage?.value || 0),
        storageUnit: editAgent.storageUsage?.unit || "MB",
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        storageValue: "0",
        storageUnit: "MB",
      });
    }
    setErrors({});
    setShowPassword(false);
    setCreateAsVerified(false);
  }, [editAgent, isOpen]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      const schema = isEditMode
        ? updateSupportAgentZodSchema
        : createSupportAgentZodSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formatted = error.format();
        const newErrors: FormErrors = {};

        for (const key in formatted) {
          if (key !== "_errors") {
            const field = formatted[key] as { _errors?: string[] };
            if (field?._errors?.length) {
              newErrors[key as keyof FormErrors] = field._errors[0];
            }
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      if (isEditMode && editAgent) {
        // Edit existing agent
        const updateBody: Record<string, unknown> = {
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          storageUsage: {
            value: Number(formData.storageValue) || 0,
            unit: formData.storageUnit || "MB",
          },
        };

        // Only include password if provided
        if (formData.password) {
          updateBody.password = formData.password;
        }

        await updateUser({
          id: editAgent._id,
          body: updateBody,
        }).unwrap();

        toast.success("Agent updated successfully!");
        onSuccess();
      } else {
        // Add new agent
        const submitData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          isVerified: createAsVerified,
          storageUsage: {
            value: Number(formData.storageValue) || 0,
            unit: formData.storageUnit as StorageUnit,
          },
        };

        const result = await createSupportAgent(submitData).unwrap();
        toast.success("Agent created successfully!");

        // Pass the created agent data back to parent
        const createdAgent: IUser = {
          _id: result.data?._id || "",
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          role: "SUPPORT_AGENT",
          isActive: "PENDING",
          isVerified: createAsVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        onSuccess(createdAgent);
      }
    } catch (error: unknown) {
      console.error("Error saving agent:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to save agent. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      storageValue: "0",
      storageUnit: "MB",
    });
    setErrors({});
    setShowPassword(false);
    setCreateAsVerified(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Agent" : "Add New Agent"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="agent-name" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agent-name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="agent-email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agent-email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
              disabled={isEditMode} // Disable email editing in edit mode
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="agent-phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="agent-phone"
              type="tel"
              placeholder="Enter phone number"
              value={formatPhoneNumber(formData.phone)}
              onChange={(e) =>
                handleInputChange(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="agent-password" className="text-sm font-medium">
              Password {!isEditMode && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative mt-1">
              <Input
                id="agent-password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEditMode
                    ? "Leave empty to keep current password"
                    : "Enter password"
                }
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            {!isEditMode && (
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 8 characters with 1 uppercase, 1
                number, and 1 special character (!@#$%^&*)
              </p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <Label htmlFor="agent-address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="agent-address"
              type="text"
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Role Display (Read-only for agents) */}
          <div>
            <Label className="text-sm font-medium">Role</Label>
            <Input
              type="text"
              value="Support Agent"
              disabled
              className="mt-1 bg-muted"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Agents are automatically assigned the Support Agent role
            </p>
          </div>

          {/* Storage Usage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="agent-storageValue"
                className="text-sm font-medium"
              >
                Storage Usage
              </Label>
              <Input
                id="agent-storageValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.storageValue}
                onChange={(e) =>
                  handleInputChange("storageValue", e.target.value)
                }
                className={`mt-1 ${errors.storageValue ? "border-red-500" : ""}`}
              />
              {errors.storageValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.storageValue}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="agent-storageUnit"
                className="text-sm font-medium"
              >
                Unit
              </Label>
              <Select
                value={formData.storageUnit}
                onValueChange={(value) =>
                  handleInputChange("storageUnit", value as StorageUnit)
                }
              >
                <SelectTrigger
                  className={`mt-1 ${errors.storageUnit ? "border-red-500" : ""}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                </SelectContent>
              </Select>
              {errors.storageUnit && (
                <p className="mt-1 text-sm text-red-600">{errors.storageUnit}</p>
              )}
            </div>
          </div>

          {/* Create as verified checkbox */}
          {!isEditMode && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agent-create-verified"
                checked={createAsVerified}
                onCheckedChange={(val) => setCreateAsVerified(Boolean(val))}
              />
              <Label
                htmlFor="agent-create-verified"
                className="text-sm font-medium cursor-pointer"
              >
                Create as verified agent
              </Label>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Agent"
              ) : (
                "Create Agent"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAgentModal;