import { useState, useEffect, useRef } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, MapPin, Clock, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useUploadFileMutation } from "@/redux/features/upload/uploadApiSlice";
import { useCreateMyOrgSettingMutation, useUpdateMyOrgSettingMutation } from "@/redux/features/orgSetting/orgSettingApiSlice";
import { useUpdateOrgMutation } from "@/redux/features/org/orgApiSlice";
import { useGoogleMaps } from "@/providers/GoogleMaps.provider";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import ImageUploadPreview from "@/components/ui/ImageUploadPreview";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Timezone options
const timezones = [
    // Eastern
    'America/New_York',

    // Central
    'America/Chicago',

    // Mountain (with DST)
    'America/Denver',

    // Mountain (no DST – US & Canada)
    'America/Phoenix',

    // Pacific
    'America/Los_Angeles',

    // Alaska
    'America/Anchorage',

    // Hawaii
    'Pacific/Honolulu',

    // Atlantic (Canada)
    'America/Halifax',

    // Newfoundland (Canada – 30 min offset)
    'America/St_Johns'
];

const defaultCenter = {
    lat: 23.8103,
    lng: 90.4125,
};

const containerStyle = {
    width: "100%",
    height: "300px",
};

interface OrganizationSetupModalProps {
    open: boolean;
    userData: {
        data?: {
            _id?: string;
            org?: {
                _id?: string;
                orgAddress?: {
                    address?: string;
                    street?: string;
                    city?: string;
                    state?: string;
                    zip?: string;
                };
            };
        };
    };
    existingSettings: {
        data?: {
            branding?: {
                logoUrl?: string;
                primaryColor?: string;
                secondaryColor?: string;
                primaryTextColor?: string;
                secondaryTextColor?: string;
            };
            timezone?: string;
            businessHours?: Array<{ dow: number; opens: string; closes: string }>;
            holidays?: Array<{ date: string; name: string }>;
        };
    };
    orgId: string;
    userId: string;
    onSuccess: () => void;
}

export const OrganizationSetupModal = ({
    open,
    userData,
    existingSettings,
    orgId,
    userId,
    onSuccess,
}: OrganizationSetupModalProps) => {
    const { isLoaded } = useGoogleMaps();

    // API hooks
    const [uploadFile] = useUploadFileMutation();
    const [createMyOrgSetting] = useCreateMyOrgSettingMutation();
    const [updateMyOrgSetting] = useUpdateMyOrgSettingMutation();
    const [updateOrg] = useUpdateOrgMutation();

    // Form state
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [timezone, setTimezone] = useState<string>("America/Los_Angeles");
    const [position, setPosition] = useState(defaultCenter);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [locationData, setLocationData] = useState({
        searchLocation: "",
        address: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Fix Google Autocomplete dropdown z-index and pointer events
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .pac-container {
                z-index: 99999;
                pointer-events: auto !important;
            }
            .pac-item {
                cursor: pointer !important;
                pointer-events: auto !important;
            }
            .pac-item:hover {
                background-color: #f0f0f0 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Initialize form with existing data
    useEffect(() => {
        if (existingSettings?.data) {
            setTimezone(existingSettings.data.timezone || "America/Los_Angeles");
            setLogoPreview(existingSettings.data.branding?.logoUrl || "");
        }

        if (userData?.data?.org?.orgAddress) {
            const orgAddress = userData.data.org.orgAddress;
            setLocationData({
                searchLocation: orgAddress.address || "",
                address: orgAddress.address || "",
                street: orgAddress.street || "",
                city: orgAddress.city || "",
                state: orgAddress.state || "",
                zip: orgAddress.zip || "",
            });
        }
    }, [existingSettings, userData]);

    const handleImageSelect = (file: File | null) => {
        setSelectedLogoFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogoImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadFile(formData).unwrap();
            return result.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload logo image');
        }
    };

    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const parseAddressComponents = (place: google.maps.places.PlaceResult) => {
        let streetNumber = "";
        let route = "";
        let city = "";
        let state = "";
        let zip = "";

        if (place.address_components) {
            for (const component of place.address_components) {
                const types = component.types;

                if (types.includes("street_number")) {
                    streetNumber = component.long_name;
                }
                if (types.includes("route")) {
                    route = component.long_name;
                }
                if (types.includes("locality") || types.includes("sublocality")) {
                    city = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                    state = component.short_name;
                }
                if (types.includes("postal_code")) {
                    zip = component.long_name;
                }
            }
        }

        const fullAddress = `${streetNumber} ${route}`.trim();
        const street = route;

        setLocationData(prev => ({
            ...prev,
            address: fullAddress,
            street: street,
            city: city,
            state: state,
            zip: zip,
        }));
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setPosition({ lat, lng });
        setLocationData(prev => ({
            ...prev,
            searchLocation: place.formatted_address || "",
        }));
        parseAddressComponents(place);
    };

    const validateForm = (): string | null => {
        // Check if logo is provided
        const hasLogo = selectedLogoFile || logoPreview || existingSettings?.data?.branding?.logoUrl;
        if (!hasLogo) {
            return "Please upload an organization logo";
        }

        // Check if timezone is selected
        if (!timezone) {
            return "Please select a timezone";
        }

        // Check if address is provided
        if (!locationData.address || !locationData.address.trim()) {
            return "Please provide an organization address";
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Setting up your organization...");

        try {
            let logoUrl = existingSettings?.data?.branding?.logoUrl || "";

            // Upload logo if new file selected
            if (selectedLogoFile) {
                try {
                    logoUrl = await uploadLogoImage(selectedLogoFile);
                } catch (error) {
                    toast.error('Failed to upload logo', { id: toastId });
                    setIsSubmitting(false);
                    return;
                }
            }

            // Prepare organization settings data
            const settingsData = {
                org: orgId,
                branding: {
                    logoUrl: logoUrl,
                    primaryColor: existingSettings?.data?.branding?.primaryColor || '#3B5E3D',
                    secondaryColor: existingSettings?.data?.branding?.secondaryColor || '#DBB700',
                    primaryTextColor: existingSettings?.data?.branding?.primaryTextColor || '#FFFFFF',
                    secondaryTextColor: existingSettings?.data?.branding?.secondaryTextColor || '#000000',
                },
                timezone: timezone,
                businessHours: existingSettings?.data?.businessHours || [],
                holidays: existingSettings?.data?.holidays || [],
            };

            // Prepare organization address data
            const orgAddressData = {
                id: orgId,
                orgAddress: {
                    address: locationData.address,
                    street: locationData.street,
                    city: locationData.city,
                    state: locationData.state,
                    zip: locationData.zip,
                },
            };

            // Call both APIs
            let settingsSuccess = false;
            let addressSuccess = false;

            // Update or create organization settings
            try {
                if (existingSettings?.data) {
                    await updateMyOrgSetting({
                        ...settingsData,
                        updatedBy: userId,
                    }).unwrap();
                } else {
                    await createMyOrgSetting({
                        ...settingsData,
                        createdBy: userId,
                    }).unwrap();
                }
                settingsSuccess = true;
            } catch (error) {
                console.error("Failed to save organization settings:", error);
                toast.error("Failed to save organization settings", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            // Update organization address
            try {
                await updateOrg(orgAddressData).unwrap();
                addressSuccess = true;
            } catch (error) {
                console.error("Failed to save organization address:", error);
                toast.error("Failed to save organization address", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            // Both API calls succeeded
            if (settingsSuccess && addressSuccess) {
                toast.success("Organization setup completed successfully!", { id: toastId });
                onSuccess();
            }
        } catch (error) {
            console.error("Setup error:", error);
            toast.error("Failed to complete setup", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogPortal>
                {/* Custom Overlay with Blur Effect */}
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/60 backdrop-blur-md",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    )}
                />

                {/* Dialog Content */}
                <DialogPrimitive.Content
                    className={cn(
                        "fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
                        "w-full max-w-4xl max-h-[90vh] overflow-y-auto",
                        "bg-background rounded-lg border shadow-lg",
                        "p-6",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "duration-200"
                    )}
                    style={{ pointerEvents: 'auto' }}
                    onPointerDownOutside={(e) => {
                        // Allow clicks on Google autocomplete dropdown
                        const target = e.target as HTMLElement;
                        if (target.closest('.pac-container')) {
                            e.preventDefault();
                            return;
                        }
                        e.preventDefault();
                    }}
                    // onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Building2 className="w-6 h-6" />
                            Complete Your Organization Setup
                        </DialogTitle>
                        <div className="flex items-center justify-center gap-2 mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                Please complete these fields to enable full application functionality. All fields are required to proceed.
                            </p>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Logo Upload Section */}
                        <div className="space-y-3 max-w-[500px] mx-auto">
                            <div className="flex justify-center items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                <Label className="text-base font-semibold">Organization Logo *</Label>
                            </div>
                            <ImageUploadPreview
                                onImageSelect={handleImageSelect}
                                value={logoPreview}
                            />
                        </div>

                        {/* Timezone Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <Label className="text-base font-semibold">Timezone *</Label>
                            </div>
                            <Select value={timezone} onValueChange={setTimezone}>
                                <SelectTrigger>
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
                        </div>

                        {/* Organization Address Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <Label className="text-base font-semibold">Organization Address *</Label>
                            </div>

                            {!isLoaded ? (
                                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-2 text-muted-foreground text-sm">Loading Google Maps...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Left Panel - Form Fields */}
                                    <div className="space-y-3">
                                        {/* Search Location */}
                                        <div className="space-y-2">
                                            <Label htmlFor="searchLocation">Search Location</Label>
                                            <Autocomplete
                                                onLoad={onLoadAutocomplete}
                                                onPlaceChanged={onPlaceChanged}
                                            >
                                                <Input
                                                    id="searchLocation"
                                                    value={locationData.searchLocation}
                                                    onChange={(e) => setLocationData(prev => ({ ...prev, searchLocation: e.target.value }))}
                                                    placeholder="Search for a location"
                                                />
                                            </Autocomplete>
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={locationData.address}
                                                onChange={(e) => setLocationData(prev => ({ ...prev, address: e.target.value }))}
                                                placeholder="Enter address"
                                            />
                                        </div>

                                        {/* Street */}
                                        <div className="space-y-2">
                                            <Label htmlFor="street">Street</Label>
                                            <Input
                                                id="street"
                                                value={locationData.street}
                                                onChange={(e) => setLocationData(prev => ({ ...prev, street: e.target.value }))}
                                                placeholder="Enter street"
                                            />
                                        </div>

                                        {/* City, State, Zip in a grid */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={locationData.city}
                                                    onChange={(e) => setLocationData(prev => ({ ...prev, city: e.target.value }))}
                                                    placeholder="City"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    value={locationData.state}
                                                    onChange={(e) => setLocationData(prev => ({ ...prev, state: e.target.value }))}
                                                    placeholder="State"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="zip">ZIP</Label>
                                                <Input
                                                    id="zip"
                                                    value={locationData.zip}
                                                    onChange={(e) => setLocationData(prev => ({ ...prev, zip: e.target.value }))}
                                                    placeholder="ZIP"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel - Map */}
                                    <div className="flex items-start justify-center">
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={position}
                                            zoom={15}
                                        >
                                            <Marker position={position} />
                                        </GoogleMap>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                size="lg"
                                className="min-w-[200px]"
                            >
                                {isSubmitting ? "Setting up..." : "Complete Setup"}
                            </Button>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
};
