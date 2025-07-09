
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CMSArticle } from './useCMSArticles';
import { useToast } from '@/hooks/use-toast';

export const useCreateCMSArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (articleData: Omit<CMSArticle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cms_articles')
        .insert(articleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-articles'] });
      toast({
        title: "Başarılı",
        description: "Makale başarıyla oluşturuldu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Makale oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateCMSArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...articleData }: Partial<CMSArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_articles')
        .update({ ...articleData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-articles'] });
      toast({
        title: "Başarılı",
        description: "Makale başarıyla güncellendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Makale güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteCMSArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-articles'] });
      toast({
        title: "Başarılı",
        description: "Makale başarıyla silindi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Makale silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const usePublishCMSArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('cms_articles')
        .update({ 
          status: 'published', 
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-articles'] });
      toast({
        title: "Başarılı",
        description: "Makale başarıyla yayınlandı.",
      });
    }
  });
};
