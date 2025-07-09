
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: status as any,
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const statusMessages = {
        confirmed: 'Rezervasyon onaylandı',
        cancelled: 'Rezervasyon iptal edildi',
        completed: 'Rezervasyon tamamlandı',
        pending: 'Rezervasyon beklemeye alındı'
      };

      toast({
        title: "Başarılı",
        description: statusMessages[variables.status as keyof typeof statusMessages] || 'Rezervasyon durumu güncellendi',
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
      toast({
        title: "Hata",
        description: "Rezervasyon durumu güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, paymentStatus }: { bookingId: string; paymentStatus: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: paymentStatus as any,
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const statusMessages = {
        paid: 'Ödeme tamamlandı',
        pending: 'Ödeme beklemeye alındı',
        failed: 'Ödeme başarısız olarak işaretlendi',
        refunded: 'Ödeme iade edildi'
      };

      toast({
        title: "Başarılı",
        description: statusMessages[variables.paymentStatus as keyof typeof statusMessages] || 'Ödeme durumu güncellendi',
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error updating payment status:', error);
      toast({
        title: "Hata",
        description: "Ödeme durumu güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Rezervasyon silindi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error deleting booking:', error);
      toast({
        title: "Hata",
        description: "Rezervasyon silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};
