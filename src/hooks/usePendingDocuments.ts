
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingDocuments = () => {
  return useQuery({
    queryKey: ['pending-documents'],
    queryFn: async () => {
      console.log('Fetching pending documents...');
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          document_type,
          file_name,
          file_url,
          file_size,
          mime_type,
          created_at,
          verified,
          clinic_id,
          clinics (
            name,
            city,
            country
          )
        `)
        .eq('verified', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending documents:', error);
        throw error;
      }
      
      console.log('Fetched pending documents:', data);
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
