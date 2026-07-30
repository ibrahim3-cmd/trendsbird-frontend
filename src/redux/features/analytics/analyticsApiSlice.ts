// Minimal stub for analytics API slice used by ConfigurationAlertBadge
export const useGetConfigurationStatusQuery = () => {
  return {
    data: {
      data: {
        allConfigured: true,
        missingConfigurations: [],
        email: { configured: false, provider: "" },
        phone: { configured: false, phoneNumber: "" },
        facebook: { configured: false, hasAdAccount: false },
        googleAds: { configured: false, hasCustomerId: false },
        googleCalendar: { configured: false, hasCalendarSelected: false },
        calendly: { configured: false, userEmail: "" },
        paymentGateway: { configured: false, provider: "" },
      },
    },
    isLoading: false,
    isError: false,
  };
};

export default {};
