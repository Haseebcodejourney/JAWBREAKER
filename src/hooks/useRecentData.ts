
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRecentData = () => {
  const recentBookings = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      console.log('Fetching recent bookings...');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles (first_name, last_name),
          clinics (name),
          treatments (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent bookings:', error);
        throw error;
      }

      console.log('Recent bookings:', data);
      return data || [];
    },
  });

  const recentClinics = useQuery({
    queryKey: ['recent-clinics'],
    queryFn: async () => {
      console.log('Fetching recent clinics...');
      
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent clinics:', error);
        throw error;
      }

      console.log('Recent clinics:', data);
      return data || [];
    },
  });

  return {
    recentBookings,
    recentClinics
  };
};
