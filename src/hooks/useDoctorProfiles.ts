
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DoctorProfile = Database['public']['Tables']['doctor_profiles']['Row'];

export const useDoctorProfiles = (clinicId?: string) => {
  return useQuery({
    queryKey: ['doctor-profiles', clinicId],
    queryFn: async () => {
      console.log('Fetching doctor profiles...', { clinicId });
      
      let query = supabase
        .from('doctor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching doctor profiles:', error);
        throw error;
      }
      
      console.log('Doctor profiles fetched:', data);
      return data || [];
    }
  });
};

export const useDoctorProfile = (id: string) => {
  return useQuery({
    queryKey: ['doctor-profile', id],
    queryFn: async () => {
      console.log('Fetching doctor profile:', id);
      
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select(`
          *,
          clinics(id, name, city, country)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching doctor profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });
};
