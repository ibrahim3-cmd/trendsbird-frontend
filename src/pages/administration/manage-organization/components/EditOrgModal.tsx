import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useGetSingleOrgQuery, useUpdateOrgMutation } from '@/redux/features/org/orgApiSlice';
import { updateOrgSchema } from '@/validations/org.schema';
import { z } from 'zod';


interface EditOrgModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    orgId: string | null;
}

interface FormData {
    orgName: string;
    orgEmail: string;
    orgPhone: string;
    orgAddress: string;
    orgStreet: string;
    orgCity: string;
    orgState: string;
    orgZip: string;
    status: string;
}

const EditOrgModal: React.FC<EditOrgModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    orgId
}) => {
    const { data: orgData, isLoading: isLoadingOrg } = useGetSingleOrgQuery(orgId!, {
        skip: !orgId
    });

    const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

    const [formData, setFormData] = useState<FormData>({
        orgName: '',
        orgEmail: '',
        orgPhone: '',
        orgAddress: '',
        orgStreet: '',
        orgCity: '',
        orgState: '',
        orgZip: '',
        status: ''
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    // Load org data when editing
    useEffect(() => {
        if (orgData) {
            console.log('Loading org data:', orgData);
            setFormData({
                orgName: orgData.orgName || '',
                orgEmail: orgData.orgEmail || '',
                orgPhone: orgData.orgPhone || '',
                orgAddress: orgData.orgAddress?.address || '',
                orgStreet: orgData.orgAddress?.street || '',
                orgCity: orgData.orgAddress?.city || '',
                orgState: orgData.orgAddress?.state || '',
                orgZip: orgData.orgAddress?.zip || '',
                status: orgData.status || ''
            });
        }
    }, [orgData]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        try {
            updateOrgSchema.parse({
                orgName: formData.orgName,
                orgEmail: formData.orgEmail || undefined,
                orgPhone: formData.orgPhone || undefined,
                orgAddress: (formData.orgAddress || formData.orgStreet || formData.orgCity || formData.orgState || formData.orgZip) ? {
                    address: formData.orgAddress || undefined,
                    street: formData.orgStreet || undefined,
                    city: formData.orgCity || undefined,
                    state: formData.orgState || undefined,
                    zip: formData.orgZip || undefined
                } : undefined,
            });

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

        if (!orgId) {
            toast.error('Organization ID not found');
            return;
        }

        try {
            const updateData = {
                orgName: formData.orgName.trim(),
                orgEmail: formData.orgEmail.trim() || undefined,
                orgPhone: formData.orgPhone.trim() || undefined,
                orgAddress: (formData.orgAddress.trim() || formData.orgStreet.trim() || formData.orgCity.trim() || formData.orgState.trim() || formData.orgZip.trim()) ? {
                    address: formData.orgAddress.trim() || undefined,
                    street: formData.orgStreet.trim() || undefined,
                    city: formData.orgCity.trim() || undefined,
                    state: formData.orgState.trim() || undefined,
                    zip: formData.orgZip.trim() || undefined
                } : undefined,
                status: formData.status || undefined
            };

            await updateOrg({
                id: orgId,
                ...updateData
            }).unwrap();

            toast.success('Organization updated successfully!');
            onSuccess();
        } catch (error: unknown) {
            console.error('Error updating organization:', error);
            const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update organization. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setFormData({
            orgName: '',
            orgEmail: '',
            orgPhone: '',
            orgAddress: '',
            orgStreet: '',
            orgCity: '',
            orgState: '',
            orgZip: '',
            status: ''
        });
        setErrors({});
        onClose();
    };

    if (isLoadingOrg) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Organization</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Organization Name Field */}
                    <div>
                        <Label htmlFor="orgName" className="text-sm font-medium">
                            Organization Name *
                        </Label>
                        <Input
                            id="orgName"
                            type="text"
                            placeholder="Enter organization name"
                            value={formData.orgName}
                            onChange={(e) => handleInputChange('orgName', e.target.value)}
                            className={`mt-1 ${errors.orgName ? 'border-red-500' : ''}`}
                        />
                        {errors.orgName && (
                            <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>
                        )}
                    </div>

                    {/* Organization Email Field */}
                    <div>
                        <Label htmlFor="orgEmail" className="text-sm font-medium">
                            Organization Email
                        </Label>
                        <Input
                            id="orgEmail"
                            type="email"
                            placeholder="Enter organization email"
                            value={formData.orgEmail}
                            onChange={(e) => handleInputChange('orgEmail', e.target.value)}
                            className={`mt-1 ${errors.orgEmail ? 'border-red-500' : ''}`}
                        />
                        {errors.orgEmail && (
                            <p className="mt-1 text-sm text-red-600">{errors.orgEmail}</p>
                        )}
                    </div>

                    {/* Organization Phone Field */}
                    <div>
                        <Label htmlFor="orgPhone" className="text-sm font-medium">
                            Organization Phone
                        </Label>
                        <Input
                            id="orgPhone"
                            type="tel"
                            placeholder="Enter organization phone"
                            value={formData.orgPhone}
                            onChange={(e) => handleInputChange('orgPhone', e.target.value)}
                            className={`mt-1 ${errors.orgPhone ? 'border-red-500' : ''}`}
                        />
                        {errors.orgPhone && (
                            <p className="mt-1 text-sm text-red-600">{errors.orgPhone}</p>
                        )}
                    </div>

                    {/* Address Information Section */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Address Information</h3>

                        {/* Address Field */}
                        <div className="mb-4">
                            <Label htmlFor="orgAddress" className="text-sm font-medium">
                                Address
                            </Label>
                            <Input
                                id="orgAddress"
                                type="text"
                                placeholder="Enter address"
                                value={formData.orgAddress}
                                onChange={(e) => handleInputChange('orgAddress', e.target.value)}
                                className={`mt-1 ${errors.orgAddress ? 'border-red-500' : ''}`}
                            />
                            {errors.orgAddress && (
                                <p className="mt-1 text-sm text-red-600">{errors.orgAddress}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Street Field */}
                            <div>
                                <Label htmlFor="orgStreet" className="text-sm font-medium">
                                    Street
                                </Label>
                                <Input
                                    id="orgStreet"
                                    type="text"
                                    placeholder="Enter street"
                                    value={formData.orgStreet}
                                    onChange={(e) => handleInputChange('orgStreet', e.target.value)}
                                    className={`mt-1 ${errors.orgStreet ? 'border-red-500' : ''}`}
                                />
                                {errors.orgStreet && (
                                    <p className="mt-1 text-sm text-red-600">{errors.orgStreet}</p>
                                )}
                            </div>

                            {/* City Field */}
                            <div>
                                <Label htmlFor="orgCity" className="text-sm font-medium">
                                    City
                                </Label>
                                <Input
                                    id="orgCity"
                                    type="text"
                                    placeholder="Enter city"
                                    value={formData.orgCity}
                                    onChange={(e) => handleInputChange('orgCity', e.target.value)}
                                    className={`mt-1 ${errors.orgCity ? 'border-red-500' : ''}`}
                                />
                                {errors.orgCity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.orgCity}</p>
                                )}
                            </div>

                            {/* State Field */}
                            <div>
                                <Label htmlFor="orgState" className="text-sm font-medium">
                                    State
                                </Label>
                                <Input
                                    id="orgState"
                                    type="text"
                                    placeholder="Enter state"
                                    value={formData.orgState}
                                    onChange={(e) => handleInputChange('orgState', e.target.value)}
                                    className={`mt-1 ${errors.orgState ? 'border-red-500' : ''}`}
                                />
                                {errors.orgState && (
                                    <p className="mt-1 text-sm text-red-600">{errors.orgState}</p>
                                )}
                            </div>

                            {/* ZIP Field */}
                            <div>
                                <Label htmlFor="orgZip" className="text-sm font-medium">
                                    ZIP Code
                                </Label>
                                <Input
                                    id="orgZip"
                                    type="text"
                                    placeholder="Enter ZIP code"
                                    value={formData.orgZip}
                                    onChange={(e) => handleInputChange('orgZip', e.target.value)}
                                    className={`mt-1 ${errors.orgZip ? 'border-red-500' : ''}`}
                                />
                                {errors.orgZip && (
                                    <p className="mt-1 text-sm text-red-600">{errors.orgZip}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Field */}
                    <div>
                        <Label htmlFor="status" className="text-sm font-medium">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                        >
                            <SelectTrigger className={`mt-1 ${errors.status ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="BLOCKED">Blocked</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                        )}
                    </div>







                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="min-w-[100px]"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Update Organization'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditOrgModal;