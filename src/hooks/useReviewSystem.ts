
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReviewData {
  clinic_id: string;
  booking_id?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

export interface ReviewResponse {
  review_id: string;
  response_from_clinic: string;
}

export const useReviewSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async (reviewData: ReviewData) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          patient_id: (await supabase.auth.getUser()).data.user?.id,
          verified: false,
          moderated: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Değerlendirme Gönderildi",
        description: "Değerlendirmeniz moderasyon sonrası yayınlanacak.",
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: "Değerlendirme Hatası",
        description: error.message || "Değerlendirme gönderilemedi.",
        variant: "destructive",
      });
    }
  });

  const voteReview = useMutation({
    mutationFn: async ({ reviewId, voteType }: { reviewId: string; voteType: 'helpful' | 'not_helpful' }) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const { data: existingVote } = await supabase
        .from('review_votes')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .single();

      if (existingVote) {
        const { error } = await supabase
          .from('review_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('review_votes')
          .insert({
            review_id: reviewId,
            user_id: userId,
            vote_type: voteType
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const respondToReview = useMutation({
    mutationFn: async ({ review_id, response_from_clinic }: ReviewResponse) => {
      const { error } = await supabase
        .from('reviews')
        .update({
          response_from_clinic: response_from_clinic,
          response_date: new Date().toISOString()
        })
        .eq('id', review_id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Yanıt Gönderildi",
        description: "Değerlendirmeye yanıtınız başarıyla gönderildi.",
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  return {
    createReview,
    voteReview,
    respondToReview
  };
};

export const useClinicReviews = (clinicId: string) => {
  return useQuery({
    queryKey: ['reviews', clinicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          ),
          review_votes (
            vote_type,
            user_id
          )
        `)
        .eq('clinic_id', clinicId)
        .eq('verified', true)
        .eq('moderated', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clinicId
  });
};
