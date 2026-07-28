import PlanCard from "@/components/ui/PlanCard";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetPlansQuery } from "@/redux/features/plan/planApiSlice";
import { useUpdatePlanPurchaseMutation } from "@/redux/features/purchase/purchaseApiSlice";
import { Plan } from "@/types/plan.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   CardElement,
//   Elements,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
// import { production, staging } from "@/constants";

// const stripePromise = loadStripe(production ? import.meta.env.VITE_STRIPE_KEY_PROD : staging ? import.meta.env.VITE_STRIPE_KEY_STAGING : import.meta.env.VITE_STRIPE_KEY);

const StripePaymentForm = ({
  selectedPlan,
  onSubmit,
  loading,
}: {
  selectedPlan: Plan;
  onSubmit: (paymentMethodId: string) => void;
  loading: boolean;
}) => {
  // const stripe = useStripe();
  // const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // if (!stripe || !elements) return;

    // const cardElement = elements.getElement(CardElement);
    // if (!cardElement) return;

    // const { error: stripeError, paymentMethod } =
    //   await stripe.createPaymentMethod({
    //     type: "card",
    //     card: cardElement,
    //   });

    // if (stripeError) {
    //   setError(stripeError.message || "Payment method creation failed");
    //   return;
    // }

    // if (paymentMethod) {
    //   onSubmit(paymentMethod.id);
    // }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <CreditCard className="w-4 h-4 text-primary" />
          Payment Information
        </h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 border rounded-lg shadow-sm bg-background">
            {/* <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#32325d",
                    "::placeholder": { color: "#a0aec0" },
                  },
                  invalid: { color: "#e53e3e" },
                },
              }}
            /> */}
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            // disabled={!stripe || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
              </span>
            ) : (
              `Update Plan - $${selectedPlan?.price || 0}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ChangePlan = () => {
  const { data: userData, refetch: refetchUser } = useUserInfoQuery(undefined);
  // console.log(userData?.data?.org?.plan);

  const { data: plans, isLoading, refetch: refetchPlans } = useGetPlansQuery();
  const [updatePlanPurchase, { isLoading: isUpdating }] =
    useUpdatePlanPurchaseMutation();

  const currentPlan = userData?.data?.org?.plan;
  const orgId = userData?.data?.org?._id;
  const userId = userData?.data?._id;

  console.log(userId);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handlePlanSelect = (plan: Plan) => {
    if (currentPlan && plan._id === currentPlan._id) {
      toast.info("This is your current active plan");
      return;
    }
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handleConfirmProceed = () => {
    setShowConfirmModal(false);
    setShowBillingModal(true);
  };

  const handleUsePreviousBilling = async () => {
    if (!selectedPlan || !orgId) return;

    try {
      await updatePlanPurchase({
        orgId,
        planId: selectedPlan._id,
        userId,
      }).unwrap();

      toast.success("Plan updated successfully!");
      setShowBillingModal(false);
      setSelectedPlan(null);

      if (refetchUser) refetchUser();
      if (refetchPlans) refetchPlans();
    } catch (error) {
      const errorMessage =
        error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
          ? (error.data as { message: string }).message
          : "Failed to update plan. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleShowPaymentForm = () => {
    setShowPaymentForm(true);
  };

  const handleNewPayment = async (paymentMethodId: string) => {
    if (!selectedPlan || !orgId) return;

    try {
      await updatePlanPurchase({
        orgId,
        planId: selectedPlan._id,
        billingInfo: {
          paymentMethodId,
        },
        userId,
      }).unwrap();

      toast.success("Plan updated successfully with new payment method!");
      setShowBillingModal(false);
      setShowPaymentForm(false);
      setSelectedPlan(null);
      if (refetchUser) refetchUser();
      if (refetchPlans) refetchPlans();
    } catch (error) {
      const errorMessage =
        error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
          ? (error.data as { message: string }).message
          : "Failed to update plan. Please try again.";
      toast.error(errorMessage);
    }
  };

  const resetModals = () => {
    setShowConfirmModal(false);
    setShowBillingModal(false);
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };
  return (
      <section className="">
        <div className="max-w-6xl mx-auto">

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Choose Your Plan
              </h2>
              <p className="mt-3 text-base font-semibold text-muted-foreground">
                Select the perfect plan for your organization's needs
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans?.map((plan: Plan) => {
                const isCurrentPlan =
                  currentPlan && plan._id === currentPlan._id;

                return (
                  <div key={plan._id} className="relative group">
                    <div
                      className={`relative transition-all duration-300 ${isCurrentPlan
                          ? "transform scale-105 shadow-2xl rounded-xl"
                          : "hover:scale-105 hover:shadow-xl"
                        }`}
                    >
                      <PlanCard
                        onSelect={() => handlePlanSelect(plan)}
                        name={plan.name}
                        description={plan.description}
                        durationUnit={plan.durationUnit}
                        durationValue={plan.durationValue}
                        price={plan.price}
                        features={plan.features}
                        showPremium={
                          plan.name.includes("Professional") ||
                          plan.name.includes("Enterprise")
                        }
                        systemColor={false}
                        isCurrentPlan={isCurrentPlan}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirmation Modal */}
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Plan Change</DialogTitle>
                <DialogDescription>
                  Are you sure you want to change your current plan and upgrade
                  to <strong>{selectedPlan?.name}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={resetModals}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmProceed}>Proceed</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Billing Options Modal */}
          <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Choose Billing Option</DialogTitle>
                <DialogDescription>
                  Would you like to continue with your previous billing
                  information or add a new payment method?
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleUsePreviousBilling}
                    disabled={isUpdating}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span className="font-medium">
                          Use Previous Billing
                        </span>
                        <span className="text-xs opacity-80">
                          Continue with existing payment method
                        </span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShowPaymentForm}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <span className="font-medium">Add New Payment Method</span>
                    <span className="text-xs opacity-80">
                      Update billing information
                    </span>
                  </Button>
                </div>

                {/* Payment Form - Show when user selects new payment method */}
                {showPaymentForm && selectedPlan && orgId && (
                  <div className="mt-6 border-t pt-4">
                    <StripePaymentForm
                      selectedPlan={selectedPlan}
                      onSubmit={handleNewPayment}
                      loading={isUpdating}
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
  );
};

export default ChangePlan;
