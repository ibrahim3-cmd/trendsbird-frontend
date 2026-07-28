import { useState, useEffect, useRef } from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  useGetSingleOrgQuery,
  useUpdateOrgMutation,
} from "@/redux/features/org/orgApiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { updateOrgSchema } from "@/validations/org.schema";
import { z } from "zod";
import {
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMaps.provider";

type LatLng = {
  lat: number;
  lng: number;
};

const defaultCenter: LatLng = {
  lat: 23.8103, // Default coordinates
  lng: 90.4125,
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const OrgDetails = () => {
  const { isLoaded } = useGoogleMaps();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [position, setPosition] = useState<LatLng>(defaultCenter);

  const { data } = useUserInfoQuery(undefined);
  const { data: orgData, isLoading } = useGetSingleOrgQuery(data?.data?.org?._id, {
    skip: !data?.data?.org?._id,
  });
  
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

  const [formData, setFormData] = useState({
    orgName: "",
    orgEmail: "",
    orgPhone: "",
    orgAddress: {
      searchLocation: "",
      address: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      lat: 0,
      lng: 0,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form data when orgData is loaded
  useEffect(() => {
    if (orgData) {
      setFormData({
        orgName: orgData.orgName || "",
        orgEmail: orgData.orgEmail || "",
        orgPhone: orgData.orgPhone || "",
        orgAddress: {
          searchLocation: orgData.orgAddress?.searchLocation || "",
          address: orgData.orgAddress?.address || "",
          street: orgData.orgAddress?.street || "",
          city: orgData.orgAddress?.city || "",
          state: orgData.orgAddress?.state || "",
          zip: orgData.orgAddress?.zip || "",
          lat: orgData.orgAddress?.lat || 0,
          lng: orgData.orgAddress?.lng || 0,
        },
      });

      // Update map position if coordinates exist
      if (orgData.orgAddress?.lat && orgData.orgAddress?.lng) {
        setPosition({ 
          lat: orgData.orgAddress.lat, 
          lng: orgData.orgAddress.lng 
        });
      }
    }
  }, [orgData]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("orgAddress.")) {
      const addressField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        orgAddress: {
          ...prev.orgAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
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

    // Update form values - clear all fields first, then set new values
    setFormData(prev => ({
      ...prev,
      orgAddress: {
        ...prev.orgAddress,
        address: fullAddress,
        street: street,
        city,
        state,
        zip,
      }
    }));
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setPosition({ lat, lng });
    
    setFormData(prev => ({
      ...prev,
      orgAddress: {
        ...prev.orgAddress,
        searchLocation: place.formatted_address || "",
        lat,
        lng,
      }
    }));
    
    parseAddressComponents(place);
  };

  const handleUpdate = async () => {
    try {
      if (!orgData?._id) {
        toast.error("Organization ID not found");
        return;
      }

      // Validate form data
      try {
        updateOrgSchema.parse(formData);
        setErrors({});
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
          toast.error("Please fix the form errors");
          return;
        }
      }

      const updateData = {
        id: orgData._id,
        ...formData,
      };

      await updateOrg(updateData).unwrap();
      toast.success("Organization updated successfully!");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Failed to update organization";
      toast.error(errorMessage || "Failed to update organization");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Organization Details
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={formData.orgName}
                onChange={(e) => handleInputChange("orgName", e.target.value)}
                placeholder="Enter organization name"
                required
                className={errors.orgName ? 'border-red-500' : ''}
              />
              {errors.orgName && (
                <p className="text-sm text-red-600">{errors.orgName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgEmail">Organization Email *</Label>
              <Input
                id="orgEmail"
                type="email"
                value={formData.orgEmail}
                onChange={(e) => handleInputChange("orgEmail", e.target.value)}
                placeholder="Enter organization email"
                required
                disabled
                className={errors.orgEmail ? 'border-red-500' : ''}
              />
              {errors.orgEmail && (
                <p className="text-sm text-red-600">{errors.orgEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgPhone">Phone Number</Label>
              <Input
                id="orgPhone"
                value={formatPhoneNumber(formData.orgPhone)}
                onChange={(e) => handleInputChange("orgPhone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter phone number"
                className={errors.orgPhone ? 'border-red-500' : ''}
              />
              {errors.orgPhone && (
                <p className="text-sm text-red-600">{errors.orgPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Current Plan</Label>
              <div className="p-2 py-[5px] rounded-md border">
                <span className="text-sm text-gray-600">
                  {orgData?.plan?.name || "No plan selected"}
                </span>
                {orgData?.plan?.price && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    (${orgData.plan.price}/{orgData.plan.durationUnit?.toLowerCase()})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Form Fields */}
              <div className="space-y-4">
                {/* Search & Add Location */}
                <div className="space-y-2">
                  <Label htmlFor="searchLocation" className="text-base font-semibold">
                    Search & Add Location
                  </Label>
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <Input
                      id="searchLocation"
                      value={formData.orgAddress.searchLocation}
                      onChange={(e) => handleInputChange("orgAddress.searchLocation", e.target.value)}
                      placeholder="Search location"
                      className="w-full"
                    />
                  </Autocomplete>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-semibold">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.orgAddress.address}
                    onChange={(e) => handleInputChange("orgAddress.address", e.target.value)}
                    placeholder="Enter address"
                    className="w-full"
                  />
                </div>

                {/* Street */}
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-base font-semibold">
                    Street
                  </Label>
                  <Input
                    id="street"
                    value={formData.orgAddress.street}
                    onChange={(e) => handleInputChange("orgAddress.street", e.target.value)}
                    placeholder="Enter street"
                    className="w-full"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-base font-semibold">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.orgAddress.city}
                    onChange={(e) => handleInputChange("orgAddress.city", e.target.value)}
                    placeholder="Enter city"
                    className="w-full"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-base font-semibold">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.orgAddress.state}
                    onChange={(e) => handleInputChange("orgAddress.state", e.target.value)}
                    placeholder="Enter state"
                    className="w-full"
                  />
                </div>

                {/* Zip */}
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-base font-semibold">
                    ZIP Code
                  </Label>
                  <Input
                    id="zip"
                    value={formData.orgAddress.zip}
                    onChange={(e) => handleInputChange("orgAddress.zip", e.target.value)}
                    placeholder="Enter ZIP code"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Right Panel - Map */}
              <div className="flex items-center justify-center">
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            size="lg"
            className="min-w-[150px]"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
      </div>
    </div>
  );
};

export default OrgDetails;
