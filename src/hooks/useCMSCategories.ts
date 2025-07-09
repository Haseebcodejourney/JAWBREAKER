
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCMSCategories = () => {
  return useQuery({
    queryKey: ['cms-categories'],
    queryFn: async () => {
      console.log('Fetching CMS categories...');
      
      const { data, error } = await supabase
        .from('cms_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching CMS categories:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useCreateCMSCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (categoryData: Omit<CMSCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cms_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-categories'] });
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla oluşturuldu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateCMSCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...categoryData }: Partial<CMSCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_categories')
        .update({ ...categoryData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-categories'] });
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla güncellendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteCMSCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-categories'] });
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla silindi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};
