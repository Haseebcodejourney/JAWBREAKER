
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TreatmentPackage = Database['public']['Tables']['treatment_packages']['Row'];

export const useTreatmentPackages = (treatmentId?: string) => {
  return useQuery({
    queryKey: ['treatment-packages', treatmentId],
    queryFn: async () => {
      console.log('Fetching treatment packages...', { treatmentId });
      
      let query = supabase
        .from('treatment_packages')
        .select(`
          *,
          treatments(id, name, category)
        `)
        .eq('is_active', true)
        .order('price');

      if (treatmentId) {
        query = query.eq('treatment_id', treatmentId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching treatment packages:', error);
        throw error;
      }
      
      console.log('Treatment packages fetched:', data);
      return data || [];
    }
  });
};

export const useTreatmentPackage = (id: string) => {
  return useQuery({
    queryKey: ['treatment-package', id],
    queryFn: async () => {
      console.log('Fetching treatment package:', id);
      
      const { data, error } = await supabase
        .from('treatment_packages')
        .select(`
          *,
          treatments(
            id,
            name,
            description,
            category,
            clinics(id, name, city, country)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching treatment package:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });
};
