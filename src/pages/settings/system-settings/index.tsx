
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Palette, Clock, Calendar, Globe, Save, RotateCcw, PaintBucket } from 'lucide-react';
import { toast } from 'sonner';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useDynamicTheme } from '@/context/dynamicTheme.context';

import {
  useGetOrgSettingByIdQuery,
  useCreateMyOrgSettingMutation,
  useUpdateMyOrgSettingMutation
} from '@/redux/features/orgSetting/orgSettingApiSlice';
import { useUploadFileMutation } from '@/redux/features/upload/uploadApiSlice';
import ImageUploadPreview from '@/components/ui/ImageUploadPreview';
import { ThemePreview } from '@/components/ui/ThemePreview';
import { ApiError } from '@/types/api.type.error';
import { updateOrgSettingsSchema } from '@/validations/org.schema';
import { z } from 'zod';

// Image Upload Component


// Default theme colors
const DEFAULT_PRIMARY_COLOR = '#3B5E3D';
const DEFAULT_SECONDARY_COLOR = '#DBB700';
const DEFAULT_PRIMARY_TEXT_COLOR = '#FFFFFF';
const DEFAULT_SECONDARY_TEXT_COLOR = '#000000';

// Timezone options
const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland'
];

// Days of week
const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

interface BusinessHour {
  dow: number;
  opens: string;
  closes: string;
}

interface Holiday {
  date: string;
  name: string;
}

interface OrgSettingData {
  org: string;
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    primaryTextColor: string;
    secondaryTextColor: string;
  };
  businessHours: BusinessHour[];
  holidays: Holiday[];
  timezone: string;
  createdBy?: string;
  updatedBy?: string;
}

const SystemSettings = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const orgId = userInfo?.data?.org?._id;
  const userId = userInfo?.data?._id;
  const { updateThemeColors } = useDynamicTheme();

  // Fetch organization settings for this component only
  const { data: existingSettings, isLoading: isLoadingSettings } = useGetOrgSettingByIdQuery(orgId, {
    skip: !orgId
  });
  // console.log(existingSettings);

  const [createMyOrgSetting, { isLoading: isCreating }] = useCreateMyOrgSettingMutation();
  const [updateMyOrgSetting, { isLoading: isUpdating }] = useUpdateMyOrgSettingMutation();
  const [uploadFile] = useUploadFileMutation();

  const [formData, setFormData] = useState<OrgSettingData>({
    org: '',
    branding: {
      logoUrl: '',
      primaryColor: DEFAULT_PRIMARY_COLOR,
      secondaryColor: DEFAULT_SECONDARY_COLOR,
      primaryTextColor: DEFAULT_PRIMARY_TEXT_COLOR,
      secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
    },
    businessHours: [],
    holidays: [],
    timezone: 'Asia/Dhaka'
  });
  // console.log(formData);

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewColors, setPreviewColors] = useState({
    primaryColor: DEFAULT_PRIMARY_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
    primaryTextColor: DEFAULT_PRIMARY_TEXT_COLOR,
    secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Load existing settings when data is available
  useEffect(() => {
    if (existingSettings?.data) {
      const settings = existingSettings.data;
      const primaryColor = settings.branding?.primaryColor || DEFAULT_PRIMARY_COLOR;
      const secondaryColor = settings.branding?.secondaryColor || DEFAULT_SECONDARY_COLOR;
      const primaryTextColor = settings.branding?.primaryTextColor || DEFAULT_PRIMARY_TEXT_COLOR;
      const secondaryTextColor = settings.branding?.secondaryTextColor || DEFAULT_SECONDARY_TEXT_COLOR;

      setFormData({
        org: settings.org || '',
        branding: {
          logoUrl: settings.branding?.logoUrl || '',
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          primaryTextColor: primaryTextColor,
          secondaryTextColor: secondaryTextColor
        },
        businessHours: settings.businessHours || [],
        holidays: settings.holidays || [],
        timezone: settings.timezone || 'Asia/Dhaka',
        createdBy: settings.createdBy,
        updatedBy: settings.updatedBy
      });

      // Set preview colors to match loaded settings
      setPreviewColors({
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        primaryTextColor: primaryTextColor,
        secondaryTextColor: secondaryTextColor
      });

      // Set selected days based on existing business hours
      const days = settings.businessHours?.map((bh: BusinessHour) => bh.dow) || [];
      setSelectedDays(days);

      // Note: Theme colors are now applied at the root level via DynamicThemeProvider
      // No need to apply them here
    } else if (orgId) {
      // Set org ID when no existing settings
      setFormData(prev => ({
        ...prev,
        org: orgId
      }));

      // IMPORTANT: Set preview colors to match formData defaults to ensure synchronization
      setPreviewColors({
        primaryColor: DEFAULT_PRIMARY_COLOR,
        secondaryColor: DEFAULT_SECONDARY_COLOR,
        primaryTextColor: DEFAULT_PRIMARY_TEXT_COLOR,
        secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
      });

      // Automatically apply default theme colors to the entire project when no existing settings
      updateThemeColors(
        DEFAULT_PRIMARY_COLOR,
        DEFAULT_SECONDARY_COLOR,
        DEFAULT_PRIMARY_TEXT_COLOR,
        DEFAULT_SECONDARY_TEXT_COLOR
      );
    }
  }, [existingSettings, orgId, updateThemeColors]);

  // Apply default theme colors on component mount if no existing settings and no localStorage theme
  useEffect(() => {
    // Only apply if we don't have existing settings and no saved theme in localStorage
    if (!existingSettings?.data && !localStorage.getItem('dynamic-theme-primary')) {
      updateThemeColors(
        DEFAULT_PRIMARY_COLOR,
        DEFAULT_SECONDARY_COLOR,
        DEFAULT_PRIMARY_TEXT_COLOR,
        DEFAULT_SECONDARY_TEXT_COLOR
      );
    }
  }, [existingSettings, updateThemeColors]);

  // Ensure preview colors are always synchronized with form data initially
  useEffect(() => {
    // If we don't have existing settings and preview colors don't match form data, sync them
    if (!existingSettings?.data && !isPreviewMode) {
      setPreviewColors({
        primaryColor: formData.branding.primaryColor,
        secondaryColor: formData.branding.secondaryColor,
        primaryTextColor: formData.branding.primaryTextColor,
        secondaryTextColor: formData.branding.secondaryTextColor
      });
    }
  }, [formData.branding, existingSettings, isPreviewMode]);

  const handleBrandingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value
      }
    }));
  };

  // Preview theme colors in real-time (only for ThemePreview component)
  const handleColorPreview = (field: string, value: string) => {
    handleBrandingChange(field, value);

    // Update preview colors for ThemePreview component only
    if (field === 'primaryColor' || field === 'secondaryColor' || field === 'primaryTextColor' || field === 'secondaryTextColor') {
      const newPreviewColors = {
        primaryColor: field === 'primaryColor' ? value : formData.branding.primaryColor,
        secondaryColor: field === 'secondaryColor' ? value : formData.branding.secondaryColor,
        primaryTextColor: field === 'primaryTextColor' ? value : formData.branding.primaryTextColor,
        secondaryTextColor: field === 'secondaryTextColor' ? value : formData.branding.secondaryTextColor
      };
      setPreviewColors(newPreviewColors);
      setIsPreviewMode(true);
    }
  };

  // Reset to original colors
  const handleResetColors = () => {
    setIsPreviewMode(false);

    // Reset preview colors
    setPreviewColors({
      primaryColor: DEFAULT_PRIMARY_COLOR,
      secondaryColor: DEFAULT_SECONDARY_COLOR,
      primaryTextColor: DEFAULT_PRIMARY_TEXT_COLOR,
      secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
    });

    // Reset form colors to match
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        primaryColor: DEFAULT_PRIMARY_COLOR,
        secondaryColor: DEFAULT_SECONDARY_COLOR,
        primaryTextColor: DEFAULT_PRIMARY_TEXT_COLOR,
        secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
      }
    }));
  };

  // Handle image selection for logo
  const handleImageSelect = (file: File | null) => {
    setSelectedLogoFile(file);
    // Clear logo URL error when new file is selected
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['branding.logoUrl'];
      return newErrors;
    });
  };

  // Upload image function (to be called during form submission)
  const uploadLogoImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData).unwrap();
      return result.data.url; // Assuming the API returns { data: { url: 'uploaded-image-url' } }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload logo image');
    }
  };

  const handleDaySelection = (day: number, checked: boolean) => {
    if (checked) {
      setSelectedDays(prev => [...prev, day]);
      setFormData(prev => ({
        ...prev,
        businessHours: [
          ...prev.businessHours,
          { dow: day, opens: '09:00', closes: '18:00' }
        ]
      }));
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
      setFormData(prev => ({
        ...prev,
        businessHours: prev.businessHours.filter(bh => bh.dow !== day)
      }));
    }
    // Clear errors for business hours
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('businessHours')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleBusinessHourChange = (day: number, field: 'opens' | 'closes', value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: prev.businessHours.map(bh =>
        bh.dow === day ? { ...bh, [field]: value } : bh
      )
    }));
    // Clear errors for business hours
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('businessHours')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const addHoliday = () => {
    setFormData(prev => ({
      ...prev,
      holidays: [
        ...prev.holidays,
        { date: '', name: '' }
      ]
    }));
  };

  const removeHoliday = (index: number) => {
    setFormData(prev => ({
      ...prev,
      holidays: prev.holidays.filter((_, i) => i !== index)
    }));
  };

  const handleHolidayChange = (index: number, field: 'date' | 'name', value: string) => {
    setFormData(prev => ({
      ...prev,
      holidays: prev.holidays.map((holiday, i) =>
        i === index ? { ...holiday, [field]: value } : holiday
      )
    }));
    // Clear errors for holidays
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('holidays')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgId || !userId) {
      toast.error('User information not available');
      return;
    }

    // Prepare data for validation
    const dataToValidate = {
      branding: {
        logoUrl: formData.branding.logoUrl || "",
        primaryColor: formData.branding.primaryColor,
        secondaryColor: formData.branding.secondaryColor,
        primaryTextColor: formData.branding.primaryTextColor,
        secondaryTextColor: formData.branding.secondaryTextColor
      },
      businessHours: formData.businessHours,
      holidays: formData.holidays,
      timezone: formData.timezone
    };

    // Validate using Zod schema
    try {
      updateOrgSettingsSchema.parse(dataToValidate);
      setErrors({}); // Clear errors if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
        return;
      }
    }

    try {
      let logoUrl = formData.branding.logoUrl;

      // Upload logo image if a new one was selected
      if (selectedLogoFile) {
        try {
          logoUrl = await uploadLogoImage(selectedLogoFile);
          // toast.success('Logo uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload logo. Please try again.');
          return;
        }
      }

      const submitData = {
        ...formData,
        org: orgId,
        branding: {
          primaryColor: formData.branding.primaryColor,
          secondaryColor: formData.branding.secondaryColor,
          primaryTextColor: formData.branding.primaryTextColor,
          secondaryTextColor: formData.branding.secondaryTextColor,
          ...(logoUrl && { logoUrl: logoUrl })
        }
      };
      // console.log('Submitting data:', submitData);

      if (existingSettings) {
        // Update existing settings
        const result = await updateMyOrgSetting({
          ...submitData,
          updatedBy: userId
        }).unwrap();

        // The theme colors will be automatically applied by the root DynamicThemeProvider
        // when the organization settings are refetched
        setIsPreviewMode(false);
        setSelectedLogoFile(null); // Clear selected logo file after successful save

        toast.success('Organization settings updated successfully');

        // Manually trigger theme update for immediate feedback
        if (result?.data?.branding) {
          updateThemeColors(
            result.data.branding.primaryColor || formData.branding.primaryColor,
            result.data.branding.secondaryColor || formData.branding.secondaryColor,
            result.data.branding.primaryTextColor || formData.branding.primaryTextColor,
            result.data.branding.secondaryTextColor || formData.branding.secondaryTextColor
          );
        } else {
          updateThemeColors(
            formData.branding.primaryColor,
            formData.branding.secondaryColor,
            formData.branding.primaryTextColor,
            formData.branding.secondaryTextColor
          );
        }
      } else {
        // Create new settings
        const result = await createMyOrgSetting({
          ...submitData,
          branding: {
            ...submitData.branding,
            logoUrl: submitData.branding.logoUrl ? submitData.branding.logoUrl : undefined
          },
          createdBy: userId
        }).unwrap();

        // The theme colors will be automatically applied by the root DynamicThemeProvider
        setIsPreviewMode(false);
        setSelectedLogoFile(null); // Clear selected logo file after successful save

        toast.success('Organization settings created successfully');

        // Manually trigger theme update for immediate feedback
        if (result?.data?.branding) {
          updateThemeColors(
            result.data.branding.primaryColor || formData.branding.primaryColor,
            result.data.branding.secondaryColor || formData.branding.secondaryColor,
            result.data.branding.primaryTextColor || formData.branding.primaryTextColor,
            result.data.branding.secondaryTextColor || formData.branding.secondaryTextColor
          );
        } else {
          updateThemeColors(
            formData.branding.primaryColor,
            formData.branding.secondaryColor,
            formData.branding.primaryTextColor,
            formData.branding.secondaryTextColor
          );
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      const err = error as ApiError;
      toast.error(err?.data?.message || 'Failed to save settings. Please try again.');
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding Section */}
        <div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding

              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Organization Logo</Label>
                <ImageUploadPreview
                  value={formData.branding.logoUrl}
                  onImageSelect={handleImageSelect}
                  width={120}
                  height={120}
                  uploadButtonText="Upload Organization Logo"
                  changeButtonText="Change Image"
                />
                {errors['branding.logoUrl'] && (
                  <p className="text-xs text-red-500 mt-1">{errors['branding.logoUrl']}</p>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Timezone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    key={formData.timezone}
                    value={formData.timezone}
                    onValueChange={(value) => { 
                      setFormData(prev => ({ ...prev, timezone: value }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors['timezone'];
                        return newErrors;
                      });
                    }}
                  >
                    <SelectTrigger className={errors['timezone'] ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors['timezone'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['timezone']}</p>
                  )}
                </CardContent>
              </Card>

              {/* Colors */}

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PaintBucket className="w-5 h-5" />
                  Theme Colors
                  {/* {isPreviewMode && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Preview Mode
                  </span>
                )} */}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetColors}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-[-10px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="primaryColor" className="text-xs font-medium">
                      Primary Color
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.branding.primaryColor}
                        onChange={(e) => handleColorPreview('primaryColor', e.target.value)}
                        className="h-10 w-full p-0 m-0 rounded-none"
                        required
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Used for buttons, links, and accents
                    </p> */}
                  </div>
                  <div>
                    <Label htmlFor="primaryTextColor" className="text-xs font-medium">
                      Primary Text Color
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primaryTextColor"
                        type="color"
                        value={formData.branding.primaryTextColor}
                        onChange={(e) => handleColorPreview('primaryTextColor', e.target.value)}
                        className="h-10 w-full p-0 m-0 rounded-none"
                        required
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Text color on primary backgrounds
                    </p> */}
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor" className="text-xs font-medium">
                      Secondary Color
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={formData.branding.secondaryColor}
                        onChange={(e) => handleColorPreview('secondaryColor', e.target.value)}
                        className="h-10 w-full p-0 m-0 rounded-none"
                        required
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Used for backgrounds and secondary elements
                    </p> */}
                  </div>
                  <div>
                    <Label htmlFor="secondaryTextColor" className="text-xs font-medium">
                      Secondary Text Color
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondaryTextColor"
                        type="color"
                        value={formData.branding.secondaryTextColor}
                        onChange={(e) => handleColorPreview('secondaryTextColor', e.target.value)}
                        className="h-10 w-full p-0 m-0 rounded-none"
                        required
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Text color on secondary backgrounds
                    </p> */}
                  </div>
                </div>

                {/* {isPreviewMode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🎨 Colors are being previewed in the Theme Preview section! Save your settings to apply them to the entire project.
                    </p>
                  </div>
                )} */}
              </div>

              {/* <Separator className="my-4" /> */}

              <ThemePreview
                primaryColor={isPreviewMode ? previewColors.primaryColor : formData.branding.primaryColor}
                secondaryColor={isPreviewMode ? previewColors.secondaryColor : formData.branding.secondaryColor}
                primaryTextColor={isPreviewMode ? previewColors.primaryTextColor : formData.branding.primaryTextColor}
                secondaryTextColor={isPreviewMode ? previewColors.secondaryTextColor : formData.branding.secondaryTextColor}
              />
            </CardContent>
          </Card>

          {/* Business Hours Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const isSelected = selectedDays.includes(day.value);
                  const businessHour = formData.businessHours.find(bh => bh.dow === day.value);
                  const businessHourIndex = formData.businessHours.findIndex(bh => bh.dow === day.value);

                  return (
                    <div key={day.value} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleDaySelection(day.value, checked as boolean)}
                        />
                        <Label htmlFor={`day-${day.value}`} className="font-medium">
                          {day.label}
                        </Label>
                      </div>

                      {isSelected && businessHour && (
                        <div className="ml-6 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Opens</Label>
                            <Input
                              type="time"
                              value={businessHour.opens}
                              onChange={(e) => handleBusinessHourChange(day.value, 'opens', e.target.value)}
                              className={`mt-1 ${errors[`businessHours.${businessHourIndex}.opens`] ? 'border-red-500' : ''}`}
                              required
                            />
                            {errors[`businessHours.${businessHourIndex}.opens`] && (
                              <p className="text-xs text-red-500 mt-1">{errors[`businessHours.${businessHourIndex}.opens`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm">Closes</Label>
                            <Input
                              type="time"
                              value={businessHour.closes}
                              onChange={(e) => handleBusinessHourChange(day.value, 'closes', e.target.value)}
                              className={`mt-1 ${errors[`businessHours.${businessHourIndex}.closes`] ? 'border-red-500' : ''}`}
                              required
                            />
                            {errors[`businessHours.${businessHourIndex}.closes`] && (
                              <p className="text-xs text-red-500 mt-1">{errors[`businessHours.${businessHourIndex}.closes`]}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Holidays Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Holidays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.holidays.map((holiday, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="date"
                        value={holiday.date}
                        onChange={(e) => handleHolidayChange(index, 'date', e.target.value)}
                        className={errors[`holidays.${index}.date`] ? 'border-red-500' : ''}
                        required
                      />
                      {errors[`holidays.${index}.date`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`holidays.${index}.date`]}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Holiday name"
                        value={holiday.name}
                        onChange={(e) => handleHolidayChange(index, 'name', e.target.value)}
                        className={errors[`holidays.${index}.name`] ? 'border-red-500' : ''}
                        required
                      />
                      {errors[`holidays.${index}.name`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`holidays.${index}.name`]}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHoliday(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addHoliday}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            </CardContent>
          </Card>

          {/* Timezone Section */}



        </div>


        {/* Submit Button */}
        <div className="flex justify-end">
          {
            existingSettings ? (
              <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-8 text-primary-text"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Settings
                    </>
                  )}
                </Button>
            ) : (
              <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-8 text-primary-text"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
            )
          }

        </div>
      </form>
    </div>
  );
}

export default SystemSettings