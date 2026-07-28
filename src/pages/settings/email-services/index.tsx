import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetEmailConfigQuery, useTestEmailConfigMutation, useGetAvailableEmailProvidersQuery } from "@/redux/features/email/emailConfigApiSlice";
import { Settings, Send, Mail } from "lucide-react";
import ConfigureProviderModal from "./components/ConfigureProviderModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EmailServicesPage = () => {
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const { data: emailConfig, refetch } = useGetEmailConfigQuery({});
  const { data: providers } = useGetAvailableEmailProvidersQuery(undefined);

  const emailConfiguration = emailConfig?.data?.$__parent?.emailConfiguration;

  console.log("emailConfiguration", emailConfig?.data);

  const handleConfigureSuccess = () => {
    refetch();
  };

  // --- Test Email modal state & handlers ---
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendTestEmail, { isLoading: isSending }] = useTestEmailConfigMutation();


  const closeTestModal = () => {
    setTestModalOpen(false);
    setTestEmail("");
  };

  const handleSendTestEmail = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!testEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await sendTestEmail({ testEmail: testEmail}).unwrap();
      console.log("result",result);
      if(!result.data.success){
        console.error(result.data.error);
        throw new Error(result.message);
      }
      toast.success("Test email sent");
      closeTestModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send test email");
    }
  };

  // Helper function to get provider display name and logo

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Provider Cards - Left Side (1/3) */}
        <div className="w-full md:w-1/3">
          <div className="grid grid-cols-1 gap-4">
            {(providers?.data || []).filter((provider: { value: string; label: string; description: string }) => provider.value === "SMTP").map((provider: { value: string; label: string; description: string }) => {
          const isConfigured = emailConfiguration?.provider === provider.value;
          const isActive = isConfigured && emailConfiguration.isActive;
          
          return (
            <Card key={provider.value} className={`relative py-5 ${isConfigured ? "border border-primary/50" : ""}`}>
              {isConfigured && (
                <Badge 
                  variant={isActive ? "default" : "secondary"}
                  className="absolute top-4 right-4"
                >
                  {isActive ? "Active" : "Configured"}
                </Badge>
              )}
              <CardContent className="">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border">
                      <Mail className="w-9 h-9 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{provider.label}</h3>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    {isConfigured && (
                      <p className="text-sm text-muted-foreground">
                        User: {emailConfiguration.smtpConfig?.auth.user}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 justify-between">
                      <Button
                        variant={isConfigured ? "outline" : "default"}
                        className={`flex-1 ${isConfigured ? "" : "bg-primary/80"}`}
                        onClick={() => {
                          setSelectedProvider(provider.value);
                          setConfigureModalOpen(true);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        {isConfigured ? "Reconfigure" : "Configure"}
                      </Button>
                      
                      {isConfigured && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTestModalOpen(true)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
          </div>
        </div>

        <div className="border border-dashed" />

        {/* Configuration Details Section - Right Side (2/3) */}
        {emailConfiguration && (
          <div className="w-full md:w-2/3 space-y-5">
            {/* Provider Overview */}
            <Card>
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Active Configuration</h3>
                      <p className="text-sm text-muted-foreground">
                        SMTP Service
                      </p>
                    </div>
                  </div>
                  <Badge variant={emailConfiguration.isActive ? "default" : "secondary"}>
                    {emailConfiguration.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border rounded-lg shadow-sm bg-card">
                <div className="px-6 py-3 border-b">
                  <h3 className="text-base font-semibold">Email Settings</h3>
                </div>
                <div className="px-6 py-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Tracking</span>
                    <Badge className="text-xs py-0" variant={emailConfiguration.settings?.enableEmailTracking ? "default" : "secondary"}>
                      {emailConfiguration.settings?.enableEmailTracking ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Click Tracking</span>
                    <Badge className="text-xs py-0" variant={emailConfiguration.settings?.enableClickTracking ? "default" : "secondary"}>
                      {emailConfiguration.settings?.enableClickTracking ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Tracking</span>
                    <Badge className="text-xs py-0" variant={emailConfiguration.settings?.enableOpenTracking ? "default" : "secondary"}>
                      {emailConfiguration.settings?.enableOpenTracking ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>

             
              <div className="border rounded-lg shadow-sm bg-card">
                <div className="px-6 py-3 border-b">
                  <h3 className="text-base font-semibold">Rate Limits</h3>
                </div>
                <div className="px-6 py-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Limit</span>
                    <span className="font-medium text-sm">{emailConfiguration.rateLimits?.dailyLimit?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hourly Limit</span>
                    <span className="font-medium">{emailConfiguration.rateLimits?.hourlyLimit?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Email Templates */}
            {emailConfiguration.templates && emailConfiguration.templates.length > 0 && (
              <Card className="">
                {/* <CardHeader className="border-b pb-0">
                  
                </CardHeader> */}
                <div className="border-b">
                  <h3 className="text-lg font-semibold px-6 pb-3">Email Templates</h3>
                </div>
                
                <CardContent className="pt-0">
                  <div className="divide-y">
                    {emailConfiguration.templates.map((template: { name: string; subject: string; variables?: string[] }, index: number) => (
                      <div key={index} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                          </div>
                          <Badge variant="default">
                            {template.variables?.length} variables
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {template.variables?.map((variable: string, vIndex: number) => (
                            <Badge key={vIndex}  className="text-xs bg-gray-600 py-0 pb-0.5">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Configure Provider Modal */}
      <ConfigureProviderModal
        isOpen={configureModalOpen}
        onClose={() => setConfigureModalOpen(false)}
        onSuccess={handleConfigureSuccess}
        provider={selectedProvider}
        currentConfig={emailConfiguration?.provider === selectedProvider ? emailConfiguration : null}
      />

      {/* Test Email Modal */}
      <Dialog open={testModalOpen} onOpenChange={closeTestModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendTestEmail} className="space-y-4 p-2">
            <div>
              <label className="text-sm font-medium pb-2">Recipient Email</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeTestModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send Test Email"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
    
  );
};

export default EmailServicesPage;