
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateCheckoutSessionParams {
  bookingId: string;
  treatmentName: string;
  clinicName: string;
  amount: number;
  currency: string;
}

export const useStripe = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (params: CreateCheckoutSessionParams) => {
    setIsProcessing(true);
    
    try {
      console.log('Creating Stripe checkout session:', params);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          booking_id: params.bookingId,
          treatment_name: params.treatmentName,
          clinic_name: params.clinicName,
          amount: Math.round(params.amount * 100), // Convert to cents
          currency: params.currency.toLowerCase(),
          success_url: `${window.location.origin}/booking/success?booking_id=${params.bookingId}`,
          cancel_url: `${window.location.origin}/booking/cancel?booking_id=${params.bookingId}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createCheckoutSession,
    isProcessing
  };
};
