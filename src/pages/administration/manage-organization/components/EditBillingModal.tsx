import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard } from 'lucide-react';

interface EditBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orgId: string | null;
  currentPaymentMethodId?: string;
}

const StripeBillingForm: React.FC<EditBillingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  orgId,
}) => {
  // const stripe = useStripe();
  // const elements = useElements();
  // const [updateBilling, { isLoading }] = useUpdateOrgBillingInfoMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // if (!stripe || !elements) {
    //   setError('Stripe is not loaded yet. Please try again.');
    //   return;
    // }

    if (!orgId) {
      toast.error('Organization ID not found');
      return;
    }

    // const cardElement = elements.getElement(CardElement);
    // if (!cardElement) {
    //   setError('Card element not found. Please refresh and try again.');
    //   return;
    // }

    try {
      // const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: cardElement,
      // });

      // if (stripeError) {
      //   setError(stripeError.message || 'Payment method creation failed');
      //   return;
      // }

      // if (paymentMethod) {
      //   await updateBilling({
      //     orgId: orgId,
      //     billingInfo: {
      //       paymentMethodId: paymentMethod.id
      //     }
      //   }).unwrap();
        
      //   toast.success('Billing info updated successfully!');
      //   // cardElement.clear();
      //   onSuccess();
      // }
    } catch (error: unknown) {
      console.error('Error updating billing info:', error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update billing info';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Organization Billing Information</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Update this organization's payment method. This will be used for future billing cycles.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method *
            </Label>
            <div className="p-4 border rounded-lg shadow-sm bg-background mt-2">
              {/* <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#32325d',
                      fontFamily: '"Inter", sans-serif',
                      '::placeholder': { 
                        color: '#a0aec0' 
                      },
                    },
                    invalid: { 
                      color: '#e53e3e' 
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {/* <Button type="submit" disabled={!stripe || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Billing'
              )}
            </Button> */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditBillingModal: React.FC<EditBillingModalProps> = (props) => {
  return (<div>
      {/* <Elements stripe={stripePromise}>
        <StripeBillingForm {...props} />
      </Elements> */}
  </div>
    
  );
};

export default EditBillingModal;