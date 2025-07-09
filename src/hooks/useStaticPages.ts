
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  template: string;
  status: string;
  language: string;
  author_id: string;
  is_system_page: boolean;
  created_at: string;
  updated_at: string;
}

export const useStaticPages = () => {
  return useQuery({
    queryKey: ['static-pages'],
    queryFn: async () => {
      console.log('Fetching static pages...');
      
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching static pages:', error);
        throw error;
      }

      console.log('Static pages:', data);
      return data || [];
    },
  });
};

export const useStaticPage = (slug: string, language: string = 'tr') => {
  return useQuery({
    queryKey: ['static-page', slug, language],
    queryFn: async () => {
      console.log('Fetching static page:', slug, 'language:', language);
      
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .eq('language', language)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching static page:', error);
        throw error;
      }

      console.log('Static page data:', data);
      return data;
    },
  });
};
