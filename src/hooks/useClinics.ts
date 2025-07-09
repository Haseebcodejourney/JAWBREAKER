
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Clinic = Tables<'clinics'>;

export const useClinics = () => {
  return useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      console.log('Fetching clinics...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching clinics:', error);
        throw error;
      }

      console.log('Fetched clinics:', data);
      return data || [];
    },
  });
};

export const useClinicById = (id: string) => {
  return useQuery({
    queryKey: ['clinic', id],
    queryFn: async () => {
      console.log('Fetching clinic by ID:', id);
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) {
        console.error('Error fetching clinic:', error);
        throw error;
      }

      console.log('Fetched clinic:', data);
      return data;
    },
    enabled: !!id,
  });
};
