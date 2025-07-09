
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (
    bookingId: string,
    treatmentName: string,
    clinicName: string,
    amount: number,
    currency: string
  ) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId,
          treatmentName,
          clinicName,
          amount,
          currency
        }
      });

      if (error) throw error;

      // Open Stripe checkout in the same tab
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendBookingNotification = async (
    bookingId: string,
    type: 'confirmation' | 'reminder' | 'cancellation',
    recipientEmail: string,
    patientName: string,
    clinicName: string,
    treatmentName: string,
    appointmentDate: string,
    appointmentTime: string
  ) => {
    try {
      await supabase.functions.invoke('send-booking-notification', {
        body: {
          bookingId,
          type,
          recipientEmail,
          patientName,
          clinicName,
          treatmentName,
          appointmentDate,
          appointmentTime
        }
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  return {
    isProcessing,
    createCheckoutSession,
    sendBookingNotification
  };
};
