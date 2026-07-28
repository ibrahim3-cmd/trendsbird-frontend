import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import { useUpdateOrgBillingInfoMutation } from "@/redux/features/org/orgApiSlice";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
// import { production, staging } from "@/constants";

// const stripePromise = loadStripe(production ? import.meta.env.VITE_STRIPE_KEY_PROD : staging ? import.meta.env.VITE_STRIPE_KEY_STAGING : import.meta.env.VITE_STRIPE_KEY);

const StripePaymentForm = () => {
  // const stripe = useStripe();
  // const elements = useElements();
  const [updateOrgBillingInfo, { isLoading }] = useUpdateOrgBillingInfoMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // if (!stripe || !elements) {
    //   setError("Stripe is not loaded yet. Please try again.");
    //   return;
    // }

    // const cardElement = elements.getElement(CardElement);
    // if (!cardElement) {
    //   setError("Card element not found. Please refresh and try again.");
    //   return;
    // }

    try {
      // const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      //   type: "card",
      //   card: cardElement,
      // });

      // if (stripeError) {
      //   setError(stripeError.message || "Payment method creation failed");
      //   return;
      // }

      // if (paymentMethod) {
      //   await updateOrgBillingInfo({
      //     billingInfo: {
      //       paymentMethodId: paymentMethod.id,
      //     },
      //   }).unwrap();

      //   toast.success("Billing information updated successfully!");

      //   cardElement.clear();
      // }
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error &&
        error.data && typeof error.data === 'object' && 'message' in error.data
        ? (error.data as { message: string }).message
        : "Failed to update billing information. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Update Billing Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your organization's payment method. This will be used for future billing cycles.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="p-4 border rounded-lg shadow-sm bg-background mt-0.5">
              {/* <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      fontFamily: '"Inter", sans-serif',
                      "::placeholder": {
                        color: "#a0aec0"
                      },
                    },
                    invalid: {
                      color: "#e53e3e"
                    },
                  },
                }}
              /> */}
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
                type="submit"
                // disabled={!stripe || isLoading}
                className="min-w-32"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  "Update Billing Info"
                )}
              </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your payment information is securely processed by Stripe</li>
            <li>• This will update the default payment method for your organization</li>
            <li>• Changes will take effect immediately for future billing cycles</li>
            <li>• Your current subscription will not be affected</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingInfo = () => {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Billing Information
          </h2>
          <p className="text-muted-foreground">
            Manage your organization's payment methods and billing details.
          </p>
        </div>

        <StripePaymentForm />
      </div>
  );
};

export default BillingInfo;
