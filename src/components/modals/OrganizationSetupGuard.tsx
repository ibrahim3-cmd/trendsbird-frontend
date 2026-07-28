import { useEffect, useState } from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetOrgSettingByIdQuery } from "@/redux/features/orgSetting/orgSettingApiSlice";
import { OrganizationSetupModal } from "./OrganizationSetupModal";
import { Loader2 } from "lucide-react";

export const OrganizationSetupGuard = ({ children }: { children: React.ReactNode }) => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  const { data: userData, isLoading: isLoadingUser, refetch: refetchUserData } = useUserInfoQuery(undefined);
  console.log(userData?.data?.isOrgOwner);
  
  const orgId = userData?.data?.org?._id;
  const userId = userData?.data?._id;
  const userRole = userData?.data?.role;
  
  const { data: existingSettings, isLoading: isLoadingSettings, refetch: refetchOrgSettings } = useGetOrgSettingByIdQuery(orgId, {
    skip: !orgId || userRole !== "ADMIN" // Only fetch for ADMIN role
  });

  // Check if organization setup is incomplete
  useEffect(() => {
    if (!isLoadingUser && userData) {
      // Only check setup for ADMIN role
      if (userRole !== "ADMIN") {
        setIsCheckingSetup(false);
        setShowSetupModal(false);
        return;
      }

      // Wait for org settings to load (or confirm they don't exist)
      if (orgId && isLoadingSettings) {
        return; // Still loading settings
      }

      const hasAddress = Boolean(userData?.data?.org?.orgAddress?.address?.trim());
      const hasLogo = existingSettings?.data?.branding?.logoUrl?.trim() ? true : false;
      const hasTimezone = existingSettings?.data?.timezone?.trim() ? true : false;

      // If any of the 3 required fields is missing, show modal
      if (!hasAddress || !hasLogo || !hasTimezone) {
        console.log('Setup incomplete - Address:', hasAddress, 'Logo:', hasLogo, 'Timezone:', hasTimezone);
        setShowSetupModal(true);
      } else {
        setShowSetupModal(false);
      }

      setIsCheckingSetup(false);
    }
  }, [userData, existingSettings, isLoadingUser, isLoadingSettings, orgId, userRole]);

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    // Refetch data to update setup status and trigger tour
    await Promise.all([
      refetchUserData(),
      refetchOrgSettings()
    ]);
  };

  // Show full-screen loading while checking setup (only for ADMIN)
  if (isCheckingSetup || isLoadingUser) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // If setup is required, show modal WITHOUT rendering children (no sidebar) - only for ADMIN
  if (showSetupModal && userData && orgId && userId && userRole === "ADMIN") {
    return (
      <OrganizationSetupModal
        open={showSetupModal}
        userData={userData}
        existingSettings={existingSettings || { data: undefined }}
        orgId={orgId}
        userId={userId}
        onSuccess={handleSetupSuccess}
      />
    );
  }

  // Only render children (dashboard, sidebar, etc.) if setup is complete
  return <>{children}</>;
};
