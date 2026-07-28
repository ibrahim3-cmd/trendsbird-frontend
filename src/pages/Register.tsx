import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation,  } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { name } from "@/constants/name";
import { bg } from "@/constants";
import { useGetPlansQuery } from "@/redux/features/plan/planApiSlice";
// import { useCreatePurchaseMutation } from "@/redux/features/purchase/purchaseApiSlice";
import { Plan } from "@/types/plan.type";
import { Crown, Building, Mail, Phone, Loader2 } from "lucide-react";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

interface OrganizationData {
  orgName: string;
  orgEmail: string;
  orgPhone: string;
}



export default function Register() {
  const location = useLocation();
  // const navigate = useNavigate();

  const { data: plansResponse, isLoading: plansLoading } = useGetPlansQuery();
  // const [createPurchase, { isLoading: purchaseLoading }] = useCreatePurchaseMutation();

  const preSelectedPlan = location.state?.selectedPlan as Plan | undefined;

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(preSelectedPlan || null);
  const [orgData, setOrgData] = useState<OrganizationData>({
    orgName: "",
    orgEmail: "",
    orgPhone: "",
  });


  const plans = React.useMemo(() => {
    // Handle both possible response structures
    if (Array.isArray(plansResponse)) {
      return plansResponse;
    }
    return plansResponse || [];
  }, [plansResponse]);

  const activePlans = useMemo(
    () => plans
      .filter((p) => p.isActive !== false)
      .sort((a, b) => (a.serial ?? 0) - (b.serial ?? 0)),
    [plans]
  );

  // Get selected plan from navigation state

  // Set first plan as default if no plan is pre-selected and plans are loaded
  useEffect(() => {
    // If a preselected plan is provided and still active, keep it; otherwise default to first active.
    if (selectedPlan && activePlans.some((p) => p._id === selectedPlan._id)) {
      return;
    }
    if (activePlans.length > 0) {
      setSelectedPlan(activePlans[0]);
    }
  }, [activePlans, selectedPlan]);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleOrgDataChange = (field: keyof OrganizationData, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return false;
    }
    if (!orgData.orgName.trim()) {
      toast.error("Organization name is required");
      return false;
    }
    if (!orgData.orgEmail.trim()) {
      toast.error("Organization email is required");
      return false;
    }
    if (!orgData.orgPhone.trim()) {
      toast.error("Organization phone is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orgData.orgEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  if (plansLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-system-primary"></div>
          <p className="text-sm text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
      <div className={`min-h-screen ${bg}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-2 font-medium">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-system-primary hover:text-system-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose your plan and enter organization details
              </p>
            </div>



            {/* Plan Selection & Organization Details */}
              <div className="space-y-6">
                {/* Plan Selection */}
                <Card className="shadow-lg border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crown className="w-4 h-4 text-system-primary" />
                      Select Your Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activePlans.map((plan: Plan) => {
                      const isSelected = selectedPlan?._id === plan._id;
                      const isPremium = plan.name.includes("Professional") || plan.name.includes("Enterprise");

                      return (
                        <div
                          key={plan._id}
                          onClick={() => handlePlanSelect(plan)}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                            isSelected
                              ? 'border-system-primary bg-system-primary/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handlePlanSelect(plan)}
                            className="data-[state=checked]:bg-system-primary data-[state=checked]:border-system-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-base">{plan.name}</h3>
                              {isPremium && (
                                <Badge variant="secondary" className="bg-system-secondary text-system-secondary-text text-xs px-1.5 py-0.5">
                                  <Crown className="w-2.5 h-2.5 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1.5">{plan.description}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-system-primary">${plan.price}</span>
                              <span className="text-xs text-muted-foreground">
                                per {plan.durationValue} {plan.durationUnit.toLowerCase()}s
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Organization Details */}
                <Card className="shadow-lg border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="w-4 h-4 text-system-primary" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="orgName" className="text-xs font-medium">
                        Organization Name *
                      </Label>
                      <Input
                        id="orgName"
                        placeholder="Enter your organization name"
                        value={orgData.orgName}
                        onChange={(e) => handleOrgDataChange("orgName", e.target.value)}
                        className="mt-1 h-9 text-sm"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="orgEmail" className="text-xs font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email Address *
                        </Label>
                        <Input
                          id="orgEmail"
                          type="email"
                          placeholder="organization@example.com"
                          value={orgData.orgEmail}
                          onChange={(e) => handleOrgDataChange("orgEmail", e.target.value)}
                          className="mt-1 h-9 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="orgPhone" className="text-xs font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone Number *
                        </Label>
                        <Input
                          id="orgPhone"
                          placeholder="+1 (555) 123-4567"
                          value={formatPhoneNumber(orgData.orgPhone)}
                          onChange={(e) => handleOrgDataChange("orgPhone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="mt-1 h-9 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (!validateForm() || !selectedPlan) return;
                      // const purchaseData = {
                      //   orgName: orgData.orgName,
                      //   orgEmail: orgData.orgEmail,
                      //   orgPhone: orgData.orgPhone,
                      //   planId: selectedPlan._id,
                      // };
                      setLoading(true);
                      // createPurchase(purchaseData)
                      //   .unwrap()
                      //   .then(() => {
                      //     toast.success("Registration completed successfully!");
                      //     navigate("/welcome");
                      //   })
                      //   .catch((error) => {
                      //     const errorMessage = error?.data?.message || "Registration failed. Please try again.";
                      //     toast.error(errorMessage);
                      //   })
                      //   .finally(() => setLoading(false));
                    }}
                    // disabled={loading || purchaseLoading}
                    className="bg-system-primary hover:bg-system-primary/90 text-system-primary-text px-6 py-2 text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
                      </span>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </div>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-muted-foreground">
              By creating an account, you agree to {name}'s{" "}
              <Link to="/terms-conditions" className="text-system-primary hover:text-system-primary/80">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy-policy" className="text-system-primary hover:text-system-primary/80">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
  );
}
