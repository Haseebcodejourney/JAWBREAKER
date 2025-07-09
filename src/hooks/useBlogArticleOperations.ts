
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogArticle } from './useBlogArticles';
import { useToast } from '@/hooks/use-toast';

export const useCreateBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (articleData: Omit<BlogArticle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('blog_articles')
        .insert(articleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      toast({
        title: "Başarılı",
        description: "Blog makalesi başarıyla oluşturuldu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Blog makalesi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...articleData }: Partial<BlogArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_articles')
        .update({ ...articleData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      toast({
        title: "Başarılı",
        description: "Blog makalesi başarıyla güncellendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Blog makalesi güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      toast({
        title: "Başarılı",
        description: "Blog makalesi başarıyla silindi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Blog makalesi silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};

export const usePublishBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('blog_articles')
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
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      toast({
        title: "Başarılı",
        description: "Blog makalesi başarıyla yayınlandı.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Blog makalesi yayınlanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
};
