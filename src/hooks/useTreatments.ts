
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TreatmentCategory = Database['public']['Enums']['treatment_category'];

export const useTreatments = (category?: string, clinicId?: string) => {
  return useQuery({
    queryKey: ['treatments', category, clinicId],
    queryFn: async () => {
      console.log('Fetching treatments...', { category, clinicId });
      
      try {
        let query = supabase
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
            success_rate,
            features,
            included_services,
            images,
            active,
            clinics!inner(
              id, 
              name, 
              city, 
              country, 
              rating, 
              review_count
            )
          `)
          .eq('active', true);

        // Validate category against enum values before using it
        if (category) {
          const validCategories: TreatmentCategory[] = [
            'hair_transplant', 'dental', 'cosmetic_surgery', 'eye_surgery', 
            'orthopedic', 'fertility', 'cardiology', 'other', 'bariatric_surgery', 'oncology'
          ];
          
          if (validCategories.includes(category as TreatmentCategory)) {
            query = query.eq('category', category as TreatmentCategory);
          }
        }

        if (clinicId) {
          query = query.eq('clinic_id', clinicId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching treatments:', error);
          throw error;
        }
        
        console.log('Treatments fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error in useTreatments:', error);
        throw error;
      }
    }
  });
};

export const useTreatment = (id: string) => {
  return useQuery({
    queryKey: ['treatment', id],
    queryFn: async () => {
      console.log('Fetching treatment:', id);
      
      try {
        const { data, error } = await supabase
          .from('treatments')
          .select(`
            *,
            clinics(
              id,
              name,
              description,
              city,
              country,
              rating,
              review_count,
              logo_url,
              cover_image_url,
              verified,
              accreditations,
              languages,
              established_year
            )
          `)
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching treatment:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error in useTreatment:', error);
        throw error;
      }
    }
  });
};
