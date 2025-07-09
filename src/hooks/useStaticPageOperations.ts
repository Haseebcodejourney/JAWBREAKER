
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaticPage } from './useStaticPages';
import { useToast } from '@/hooks/use-toast';

export const useCreateStaticPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (pageData: Omit<StaticPage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('static_pages')
        .insert(pageData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      toast({
        title: "Başarılı",
        description: "Sayfa başarıyla oluşturuldu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Sayfa oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateStaticPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...pageData }: Partial<StaticPage> & { id: string }) => {
      const { data, error } = await supabase
        .from('static_pages')
        .update({ ...pageData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      toast({
        title: "Başarılı",
        description: "Sayfa başarıyla güncellendi.",
      });
    }
  });
};

export const useDeleteStaticPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('static_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      toast({
        title: "Başarılı",
        description: "Sayfa başarıyla silindi.",
      });
    }
  });
};
