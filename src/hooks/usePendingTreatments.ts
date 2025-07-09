
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingTreatments = () => {
  return useQuery({
    queryKey: ['pending-treatments'],
    queryFn: async () => {
      console.log('Fetching pending treatments...');
      
      const { data, error } = await supabase
        .from('treatments')
        .select(`
          id,
          name,
          description,
          category,
          price_from,
          price_to,
          currency,
          duration_days,
          recovery_days,
          created_at,
          active,
          clinic_id,
          clinics (
            name,
            city,
            country
          )
        `)
        .eq('active', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending treatments:', error);
        throw error;
      }
      
      console.log('Fetched pending treatments:', data);
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
