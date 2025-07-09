
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PriceCampaign = Database['public']['Tables']['price_campaigns']['Row'];

export const usePriceCampaigns = (clinicId?: string, treatmentId?: string) => {
  return useQuery({
    queryKey: ['price-campaigns', clinicId, treatmentId],
    queryFn: async () => {
      console.log('Fetching price campaigns...', { clinicId, treatmentId });
      
      let query = supabase
        .from('price_campaigns')
        .select(`
          *,
          clinics(id, name),
          treatments(id, name)
        `)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString().split('T')[0])
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }
      
      if (treatmentId) {
        query = query.eq('treatment_id', treatmentId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching price campaigns:', error);
        throw error;
      }
      
      console.log('Price campaigns fetched:', data);
      return data || [];
    }
  });
};
