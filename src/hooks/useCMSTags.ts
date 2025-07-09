
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CMSTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
}

export const useCMSTags = () => {
  return useQuery({
    queryKey: ['cms-tags'],
    queryFn: async () => {
      console.log('Fetching CMS tags...');
      
      const { data, error } = await supabase
        .from('cms_tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching CMS tags:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useCreateCMSTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tagData: Omit<CMSTag, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('cms_tags')
        .insert(tagData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-tags'] });
    }
  });
};

export const useDeleteCMSTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-tags'] });
    }
  });
};
