
import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export const usePaymentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processPayment = async (
    amount: number,
    currency: string,
    bookingId: string
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    
    try {
      // Call Supabase Edge Function for payment processing
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          amount,
          currency,
          bookingId,
          return_url: `${window.location.origin}/booking-success`,
          cancel_url: `${window.location.origin}/booking-cancel`
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
        return { success: true, paymentIntentId: data.paymentIntentId };
      }

      throw new Error('Payment URL not received');
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Ödeme Hatası",
        description: error.message || "Ödeme işlenirken bir hata oluştu.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string, bookingId: string) => {
    try {
      // Update booking status to confirmed
      await supabase
        .from('bookings')
        .update({ 
          payment_status: 'held',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      toast({
        title: "Ödeme Başarılı",
        description: "Rezervasyon ödemeniz başarıyla alınmıştır.",
      });
    } catch (error) {
      console.error('Payment success handling error:', error);
    }
  };

  const handlePaymentFailure = async (bookingId: string, reason?: string) => {
    try {
      // Update booking status to cancelled
      await supabase
        .from('bookings')
        .update({ 
          payment_status: 'pending',
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          notes: `Payment failed: ${reason || 'Unknown error'}`
        })
        .eq('id', bookingId);

      toast({
        title: "Ödeme Başarısız",
        description: reason || "Ödeme işlemi başarısız oldu.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Payment failure handling error:', error);
    }
  };

  return {
    isProcessing,
    processPayment,
    handlePaymentSuccess,
    handlePaymentFailure
  };
};
