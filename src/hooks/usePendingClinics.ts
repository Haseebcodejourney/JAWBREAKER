
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingClinics = () => {
  return useQuery({
    queryKey: ['pending-clinics'],
    queryFn: async () => {
      console.log('Fetching pending clinics...');
      
      const { data, error } = await supabase
        .from('clinics')
        .select(`
          id,
          name,
          description,
          city,
          country,
          email,
          phone,
          website,
          address,
          status,
          established_year,
          staff_count,
          accreditations,
          logo_url,
          cover_image_url,
          created_at,
          total_patients,
          response_time_hours,
          specialties,
          languages,
          insurance_accepted,
          transfer_services,
          hotel_partnerships,
          virtual_tour_url,
          video_tour_url
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending clinics:', error);
        throw error;
      }
      
      console.log('Fetched pending clinics:', data);
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
