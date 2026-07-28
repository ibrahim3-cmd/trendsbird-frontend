import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/redux/features/auth/auth.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { IUser, StorageUnit } from '@/types';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateUserMutation } from '@/redux/features/user/user.api';
import formatPhoneNumber from '@/utils/formatPhoneNumber';
// import { useGetAllRolesQuery } from '@/redux/features/role/roleApiSlice';
import { createUserZodSchema, updateUserZodSchema } from '@/validations/user.schema';
import z from 'zod';
import OrgSelect from '@/components/ui/OrgSelect';
import { SearchableMultiCategoryFilter } from '@/components/filters/SearchableMultiCategoryFilter';
import { useGetUserCategoriesQuery } from '@/redux/features/userCategory/userCategoryApiSlice';

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdUser?: IUser) => void;
  editUser?: IUser | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  org?: string;
  storageValue?: string;
  storageUnit?: StorageUnit;
  categories?: string[];
  hourlyRate?: string;
}



const AddEditUserModal: React.FC<AddEditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editUser
}) => {
  console.log(editUser);
  const { data: userInfo } = useUserInfoQuery(undefined);
  const orgId = userInfo?.data?.org?._id;
  const isSuperAdmin = userInfo?.data?.role === 'SUPER_ADMIN';

  // const { data: rolesData } = useGetAllRolesQuery({});
  const { data: categoriesData } = useGetUserCategoriesQuery({ page: 1, limit: 1000 });
  
  // const roleOptions = rolesData?.data?.map(role => ({ value: role.key, label: role.name })) || []
  const categories = categoriesData?.data || [];
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isRegistering || isUpdating;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    storageValue: '0',
    storageUnit: 'MB',
    categories: [],
    hourlyRate: '0'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [createAsVerified, setCreateAsVerified] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const isEditMode = !!editUser;

  // Load user data when editing
  useEffect(() => {
    if (editUser) {
      const userOrg = (editUser as IUser & { org?: { _id: string } | string }).org;
      const orgValue = typeof userOrg === 'string' ? userOrg : userOrg?._id || '';
      
      const userCategories = Array.isArray(editUser.categories)
        ? editUser.categories.map((cat: any) => typeof cat === 'string' ? cat : cat._id)
        : [];
      
      setFormData({
        name: editUser.name || '',
        email: editUser.email || '',
        phone: editUser.phone || '',
        password: '', // Don't show existing password
        role: editUser.role || 'ADMIN',
        org: orgValue,
        storageValue: String(editUser.storageUsage?.value || 0),
        storageUnit: editUser.storageUsage?.unit || 'MB',
        categories: userCategories,
        hourlyRate: String(editUser.hourlyRate || 0)
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'ADMIN',
        org: isSuperAdmin ? '' : orgId || '',
        storageValue: '0',
        storageUnit: 'MB',
        categories: [],
        hourlyRate: '0'
      });
    }
    setErrors({});
    setShowPassword(false);
    setCreateAsVerified(false);
  }, [editUser, isOpen, isSuperAdmin, orgId]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // const validateForm = (): boolean => {
  //   const newErrors: Partial<FormData> = {};

  //   // Name validation
  //   if (!formData.name.trim()) {
  //     newErrors.name = 'Name is required';
  //   }

  //   // Email validation
  //   if (!formData.email.trim()) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  //     newErrors.email = 'Please enter a valid email address';
  //   }

  //   // Password validation (required for new users, optional for edit)
  //   if (!isEditMode && !formData.password.trim()) {
  //     newErrors.password = 'Password is required';
  //   } else if (formData.password && formData.password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   // Phone validation (optional but should be valid if provided)
  //   if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
  //     newErrors.phone = 'Please enter a valid phone number';
  //   }

  //   // Role validation
  //   if (!formData.role) {
  //     newErrors.role = 'Role is required';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

const validateForm = (): boolean => {
  try {
    const schema = isEditMode ? updateUserZodSchema : createUserZodSchema;
    schema.parse(formData);
    
    // Additional validation for super admin - organization is required
    if (isSuperAdmin && !formData.org) {
      setErrors({ org: 'Organization is required' });
      return false;
    }
    
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = error.format();
      const newErrors: Record<string, string> = {};

      for (const key in formatted) {
        if (key !== "_errors") {
          const field = formatted[key] as { _errors?: string[] };
          if (field?._errors?.length) {
            newErrors[key] = field._errors[0];
          }
        }
      }
      
      // Additional validation for super admin - organization is required
      if (isSuperAdmin && !formData.org) {
        newErrors.org = 'Organization is required';
      }
      
      setErrors(newErrors);
    }

    return false;
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    // if (!orgId) {
    //   toast.error('Organization information not found');
    //   return;
    // }

    try {
      const submitData: Record<string, unknown> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        // isActive: true
      };

      // Only add org if super admin (they can select org) or if regular admin (use their org)
      if (isSuperAdmin) {
        if (formData.org) {
          submitData.org = formData.org;
        }
      } else {
        submitData.org = orgId;
      }

      // Add password only if provided (for new users or when updating password)
      if (formData.password) {
        submitData.password = formData.password;
      }

      // If creating a new user and the creator checked the box, include isVerified
      if (!isEditMode && createAsVerified) {
        submitData.isVerified = true;
      }

      if (isEditMode) {
        // Edit existing user
        const updateBody: Record<string, unknown> = {
          name: formData.name.trim(),
          // email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          role: formData.role, // Type assertion for role
          storageUsage: {
            value: Number(formData.storageValue) || 0,
            unit: formData.storageUnit || 'MB'
          },
          categories: formData.categories || [],
          hourlyRate: Number(formData.hourlyRate) || 0
        };

        // Only add org if super admin (they can select org)
        if (isSuperAdmin && formData.org) {
          updateBody.org = formData.org;
        }

        // Only include password if provided
        if (formData.password) {
          updateBody.password = formData.password;
        }

        const updatedData = await updateUser({
          id: editUser._id,
          body: updateBody
        }).unwrap();
        console.log(updatedData);
        toast.success('User updated successfully!');
        onSuccess();
      } else {
        // Add new user
        submitData.storageUsage = {
          value: Number(formData.storageValue) || 0,
          unit: formData.storageUnit || 'MB'
        };
        submitData.categories = formData.categories || [];
        submitData.hourlyRate = Number(formData.hourlyRate) || 0;
        const result = await registerUser(submitData).unwrap();
        toast.success('User created successfully!');

        // Pass the created user data back to parent
        const createdUser: IUser = {
          _id: result.data?._id || '',
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          role: formData.role,
          isActive: 'PENDING',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        onSuccess(createdUser);
      }

      // Don't call onClose() here - let the parent handle it via onSuccess
    } catch (error: unknown) {
      console.error('Error saving user:', error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to save user. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'ADMIN',
      org: isSuperAdmin ? '' : orgId || '',
      storageValue: '0',
      storageUnit: 'MB',
      categories: [],
      hourlyRate: '0'
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              disabled={isEditMode} // Disable email editing in edit mode
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formatPhoneNumber(formData.phone)}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password {!isEditMode && '*'}
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditMode ? 'Leave empty to keep current password' : 'Enter password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
          </div>

          {/* Role Field */}
          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              Role *
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={isEditMode && (editUser?.isOrgOwner === true || editUser?._id === userInfo?.data?._id)}
            >
              <SelectTrigger className={`mt-1 ${errors.role ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"ADMIN"} value={"ADMIN"}>
                    ADMIN
                </SelectItem>
                <SelectItem key={"CREW"} value={"CREW"}>
                    CREW
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
            {isEditMode && editUser?.isOrgOwner === true && (
              <p className="mt-1 text-xs text-muted-foreground">
                Role cannot be changed for organization owner
              </p>
            )}
            {isEditMode && editUser?._id === userInfo?.data?._id && !editUser?.isOrgOwner && (
              <p className="mt-1 text-xs text-muted-foreground">
                You cannot change your own role
              </p>
            )}
          </div>

          {/* Organization Field (Only for Super Admin) */}
          {isSuperAdmin && (
            <OrgSelect
              value={formData.org}
              onValueChange={(orgId) => handleInputChange('org', orgId)}
              placeholder="Select organization..."
              error={!!errors.org}
              label="Organization"
              required={true}
              errorMessage={errors.org}
            />
          )}

          {/* Categories Field */}
          <div>
            <Label htmlFor="categories" className="text-sm font-medium">
              User Categories
            </Label>
            <SearchableMultiCategoryFilter
              selectedCategories={formData.categories || []}
              onCategoriesChange={(values) => setFormData({ ...formData, categories: values })}
              categories={categories}
              placeholder="Select user categories..."
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Assign categories to classify this user
            </p>
          </div>

          {/* Hourly Rate Field */}
          <div>
            <Label htmlFor="hourlyRate" className="text-sm font-medium">
              Hourly Rate ($)
            </Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
              className={`mt-1 ${errors.hourlyRate ? 'border-red-500' : ''}`}
            />
            {errors.hourlyRate && (
              <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              User's hourly billing rate
            </p>
          </div>

          {/* Storage Usage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="storageValue" className="text-sm font-medium">
                Storage Usage {!isEditMode && '*'}
              </Label>
              <Input
                id="storageValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.storageValue}
                onChange={(e) => handleInputChange('storageValue', e.target.value)}
                className={`mt-1 ${errors.storageValue ? 'border-red-500' : ''}`}
              />
              {errors.storageValue && (
                <p className="mt-1 text-sm text-red-600">{errors.storageValue}</p>
              )}
            </div>
            <div>
              <Label htmlFor="storageUnit" className="text-sm font-medium">
                Unit {!isEditMode && '*'}
              </Label>
              <Select
                value={formData.storageUnit}
                onValueChange={(value) => handleInputChange('storageUnit', value as StorageUnit)}
              >
                <SelectTrigger className={`mt-1 ${errors.storageUnit ? 'border-red-500' : ''}`}>
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

          {!isEditMode && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-verified"
                checked={createAsVerified}
                onCheckedChange={(val) => setCreateAsVerified(Boolean(val))}
              />
              <Label htmlFor="create-verified" className="text-sm font-medium">
                Create as verified user
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
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update User' : 'Create User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditUserModal;