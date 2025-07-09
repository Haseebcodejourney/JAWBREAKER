
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingData {
  treatment_id: string;
  clinic_id: string;
  preferred_date: string;
  total_amount: number;
  currency: string;
  notes?: string;
}

export interface PaymentData {
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: string;
}

export const useBookingSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBooking = useMutation({
    mutationFn: async (bookingData: BookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          patient_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Rezervasyon Oluşturuldu",
        description: "Rezervasyonunuz başarıyla oluşturuldu.",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Rezervasyon Hatası",
        description: error.message || "Rezervasyon oluşturulamadı.",
        variant: "destructive",
      });
    }
  });

  const processPayment = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          ...paymentData,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Ödeme İşlemi Başlatıldı",
        description: "Ödeme işleminiz başarıyla başlatıldı.",
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });

  const getBookingAvailability = async (clinicId: string, date: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('preferred_date')
      .eq('clinic_id', clinicId)
      .eq('preferred_date', date)
      .eq('status', 'confirmed');

    if (error) throw error;
    return data;
  };

  return {
    createBooking,
    processPayment,
    getBookingAvailability
  };
};
