
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  language: string;
  author_id: string;
  category_id?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_featured: boolean;
  likes_count: number;
  views_count: number;
  reading_time_minutes?: number;
  tags: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
  cms_categories?: {
    name: string;
  };
}

export const useBlogArticles = () => {
  return useQuery({
    queryKey: ['blog-articles'],
    queryFn: async () => {
      console.log('Fetching blog articles...');
      
      const { data, error } = await supabase
        .from('blog_articles')
        .select(`
          *,
          cms_categories (name),
          profiles (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog articles:', error);
        throw error;
      }

      console.log('Blog articles:', data);
      return data || [];
    },
  });
};
