import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Mail,
  Facebook,
  Chrome,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  X,
  Settings,
  CreditCard,
  Phone,
} from "lucide-react";
import { useGetConfigurationStatusQuery } from "@/redux/features/analytics/analyticsApiSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConfigurationItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  configured: boolean;
  description: string;
  configureLink: string;
  details?: string;
}

const ConfigurationAlertBadge = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: configStatus, isLoading, isError } = useGetConfigurationStatusQuery();
  
  if (isLoading || isError || !configStatus?.data) {
    return null;
  }

  const { data } = configStatus;

  // If all configured, don't show the badge
  if (data.allConfigured) {
    return null;
  }

  const missingCount = data.missingConfigurations.length;

  // Build configuration items list
  const configItems: ConfigurationItem[] = [
    {
      key: "email",
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
      configured: data.email.configured,
      description: "Configure email provider for sending automated emails and notifications",
      configureLink: "/settings?tab=email-services",
      details: data.email.configured ? `Provider: ${data.email.provider}` : undefined,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: <Phone className="w-4 h-4" />,
      configured: !!data.phone?.configured,
      description: "Configure an active phone number for SMS and calling features",
      configureLink: "/settings?tab=phone-numbers",
      details: data.phone?.configured
        ? (data.phone?.phoneNumber ? `Default: ${data.phone.phoneNumber}` : "Configured")
        : undefined,
    },
    {
      key: "facebook",
      label: "Facebook Ads",
      icon: <Facebook className="w-4 h-4" />,
      configured: !!(data.facebook.configured && data.facebook.hasAdAccount),
      description: "Connect Facebook for advertising and marketing campaigns",
      configureLink: "/settings?tab=integrations",
      details: data.facebook.configured 
        ? (data.facebook.hasAdAccount ? "Ad Account Connected" : "No Ad Account Selected")
        : undefined,
    },
    {
      key: "googleAds",
      label: "Google Ads",
      icon: <Chrome className="w-4 h-4" />,
      configured: !!(data.googleAds.configured && data.googleAds.hasCustomerId),
      description: "Connect Google Ads for advertising campaigns",
      configureLink: "/settings?tab=integrations",
      details: data.googleAds.configured
        ? (data.googleAds.hasCustomerId ? "Account Connected" : "No Customer ID Selected")
        : undefined,
    },
    {
      key: "googleCalendar",
      label: "Google Calendar",
      icon: <Calendar className="w-4 h-4" />,
      configured: !!(data.googleCalendar?.configured),
      description: "Sync your Google Calendar for scheduling and appointments",
      configureLink: "/appointments?tab=calendar-settings",
      details: data.googleCalendar?.configured
        ? (data.googleCalendar?.hasCalendarSelected ? "Connected & Calendar Selected" : "Connected - Select Calendar")
        : undefined,
    },
    {
      key: "calendly",
      label: "Calendly",
      icon: <CalendarDays className="w-4 h-4" />,
      configured: data.calendly.configured,
      description: "Connect Calendly for easy appointment scheduling",
      configureLink: "/appointments?tab=calendar-settings",
      details: data.calendly.configured ? `Connected: ${data.calendly.userEmail}` : undefined,
    },
    {
      key: "paymentGateway",
      label: "Payment Gateway",
      icon: <CreditCard className="w-4 h-4" />,
      configured: !!(data.paymentGateway?.configured),
      description: "Connect payment gateway for processing payments",
      configureLink: "/settings?tab=integrations",
      details: data.paymentGateway?.configured 
        ? `Provider: ${data.paymentGateway?.provider || 'Stripe'}` 
        : undefined,
    },
  ];

  const unconfiguredItems = configItems.filter((item) => !item.configured);
  const configuredItems = configItems.filter((item) => item.configured);

  const handleConfigure = (link: string) => {
    setIsDialogOpen(false);
    navigate(link);
  };

  return (
    <>
      {/* Alert Badge Card */}
      <Card 
        className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 cursor-pointer hover:shadow-md transition-all animate-fade-in"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  {missingCount} Configuration{missingCount > 1 ? "s" : ""} Missing
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Click to view and configure integrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                {missingCount} pending
              </Badge>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          
          {/* Quick preview of missing items */}
          <div className="flex flex-wrap gap-2 mt-3">
            {unconfiguredItems.slice(0, 4).map((item) => (
              <Badge 
                key={item.key} 
                variant="secondary" 
                className="bg-amber-100/50 text-amber-700 text-xs"
              >
                {item.icon}
                <span className="ml-1">{item.label}</span>
              </Badge>
            ))}
            {unconfiguredItems.length > 4 && (
              <Badge variant="secondary" className="bg-amber-100/50 text-amber-700 text-xs">
                +{unconfiguredItems.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Integration Configuration Status
            </DialogTitle>
            <DialogDescription>
              Configure the following integrations to unlock full functionality
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Missing Configurations */}
            {unconfiguredItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Needs Configuration ({unconfiguredItems.length})
                </h4>
                <div className="space-y-2">
                  {unconfiguredItems.map((item, index) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100"
                        onClick={() => handleConfigure(item.configureLink)}
                      >
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configured Items */}
            {configuredItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Configured ({configuredItems.length})
                </h4>
                <div className="space-y-2">
                  {configuredItems.map((item, index) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-950/20 animate-fade-in"
                      style={{ animationDelay: `${(unconfiguredItems.length + index) * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          {item.details && (
                            <p className="text-xs text-green-600">{item.details}</p>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              {configuredItems.length} of {configItems.length} integrations configured
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfigurationAlertBadge;
