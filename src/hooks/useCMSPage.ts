
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCMSPage = (slug: string, language: string = 'tr') => {
  return useQuery({
    queryKey: ['cms-page', slug, language],
    queryFn: async () => {
      console.log('Fetching CMS page:', slug, 'language:', language);
      
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .eq('language', language)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching page:', error);
        throw error;
      }

      console.log('CMS page data:', data);
      return data;
    },
  });
};
