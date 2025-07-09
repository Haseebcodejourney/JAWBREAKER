
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRespondToReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          response_from_clinic: response,
          response_date: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Değerlendirme yanıtı gönderildi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('Error responding to review:', error);
      toast({
        title: "Hata",
        description: "Yanıt gönderilirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useVerifyReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reviewId, verified }: { reviewId: string; verified: boolean }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ verified })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Başarılı",
        description: variables.verified ? "Değerlendirme doğrulandı" : "Değerlendirme doğrulaması kaldırıldı",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('Error verifying review:', error);
      toast({
        title: "Hata",
        description: "Değerlendirme doğrulanırken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Değerlendirme silindi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast({
        title: "Hata",
        description: "Değerlendirme silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};
