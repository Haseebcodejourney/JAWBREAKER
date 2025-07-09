
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TravelService = Database['public']['Tables']['travel_services']['Row'];

export const useTravelServices = (clinicId?: string, serviceType?: string) => {
  return useQuery({
    queryKey: ['travel-services', clinicId, serviceType],
    queryFn: async () => {
      console.log('Fetching travel services...', { clinicId, serviceType });
      
      let query = supabase
        .from('travel_services')
        .select(`
          *,
          clinics(id, name, city, country)
        `)
        .eq('is_active', true)
        .order('service_type');

      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }
      
      if (serviceType) {
        query = query.eq('service_type', serviceType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching travel services:', error);
        throw error;
      }
      
      console.log('Travel services fetched:', data);
      return data || [];
    }
  });
};
