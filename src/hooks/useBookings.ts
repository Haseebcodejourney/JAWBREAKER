
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRateLimiting } from '@/hooks/useRateLimiting';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';

export const useBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { checkRateLimit } = useRateLimiting();

  const bookingsQuery = useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      console.log('Fetching user bookings...');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          clinics(id, name, city, country),
          treatments(id, name, price_from, price_to, currency)
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const createBooking = useMutation({
    mutationFn: async ({ treatmentId, clinicId, preferredDate, notes }: {
      treatmentId: string;
      clinicId: string;
      preferredDate: string;
      notes?: string;
    }) => {
      // Check rate limiting
      const canProceed = await checkRateLimit('create-booking', 3, 15); // 3 bookings per 15 minutes
      if (!canProceed) {
        throw new Error('Rate limit exceeded for booking creation');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate that clinic is approved and treatment is active
      const { data: clinic } = await supabase
        .from('clinics')
        .select('status')
        .eq('id', clinicId)
        .single();

      if (!clinic || clinic.status !== 'approved') {
        throw new Error('Clinic is not available for bookings');
      }

      const { data: treatment } = await supabase
        .from('treatments')
        .select('active, price_from, currency')
        .eq('id', treatmentId)
        .single();

      if (!treatment || !treatment.active) {
        throw new Error('Treatment is not available for booking');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          patient_id: user.id,
          clinic_id: clinicId,
          treatment_id: treatmentId,
          preferred_date: preferredDate,
          notes,
          total_amount: treatment?.price_from || 0,
          currency: treatment?.currency || 'USD',
          status: 'pending' as BookingStatus
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast({
        title: "Rezervasyon Oluşturuldu",
        description: "Rezervasyonunuz başarıyla oluşturuldu. Ödeme için yönlendiriliyorsunuz.",
      });
      
      // Trigger email notification
      supabase.functions.invoke('send-booking-notification', {
        body: { bookingId: data.id, type: 'created' }
      }).catch(console.error);
    },
    onError: (error: any) => {
      console.error('Booking creation error:', error);
      toast({
        title: "Rezervasyon Hatası",
        description: error.message || "Rezervasyon oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status, notes }: {
      bookingId: string;
      status: BookingStatus;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          notes: notes || undefined
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
      
      toast({
        title: "Rezervasyon Güncellendi",
        description: `Rezervasyon durumu: ${data.status}`,
      });

      // Trigger notification
      supabase.functions.invoke('send-booking-notification', {
        body: { bookingId: data.id, type: 'status_updated' }
      }).catch(console.error);
    },
    onError: (error: any) => {
      console.error('Booking update error:', error);
      toast({
        title: "Güncelleme Hatası",
        description: error.message || "Rezervasyon güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('status', 'pending'); // Only allow cancellation of pending bookings

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast({
        title: "Rezervasyon İptal Edildi",
        description: "Rezervasyonunuz başarıyla iptal edildi.",
      });
    },
    onError: (error: any) => {
      console.error('Booking cancellation error:', error);
      toast({
        title: "İptal Hatası",
        description: "Sadece bekleyen rezervasyonlar iptal edilebilir.",
        variant: "destructive"
      });
    }
  });

  return {
    bookings: bookingsQuery.data || [],
    isLoading: bookingsQuery.isLoading,
    createBooking: createBooking.mutate,
    updateBookingStatus: updateBookingStatus.mutate,
    cancelBooking: cancelBooking.mutate,
    isCreating: createBooking.isPending,
    isUpdating: updateBookingStatus.isPending
  };
};
