
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReviews = (clinicId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ['reviews', clinicId],
    queryFn: async () => {
      if (!clinicId) return [];
      
      console.log('Fetching reviews for clinic:', clinicId);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .eq('clinic_id', clinicId)
        .eq('verified', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!clinicId
  });

  const submitReview = useMutation({
    mutationFn: async ({ rating, title, content, clinicId, bookingId }: {
      rating: number;
      title: string;
      content: string;
      clinicId: string;
      bookingId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          patient_id: user.id,
          clinic_id: clinicId,
          booking_id: bookingId,
          rating,
          title,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', clinicId] });
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted and is pending verification.",
      });
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    submitReview: submitReview.mutate,
    isSubmitting: submitReview.isPending
  };
};
