
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminClinics = () => {
  return useQuery({
    queryKey: ['admin-clinics'],
    queryFn: async () => {
      console.log('Fetching all clinics for admin...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clinics:', error);
        throw error;
      }

      console.log('Fetched clinics:', data);
      return data || [];
    },
  });
};
