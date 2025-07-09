
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCreateTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (treatmentData: any) => {
      const { data, error } = await supabase
        .from('treatments')
        .insert(treatmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Tedavi başarıyla oluşturuldu",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      console.error('Error creating treatment:', error);
      toast({
        title: "Hata",
        description: "Tedavi oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...treatmentData }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('treatments')
        .update(treatmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Tedavi başarıyla güncellendi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      console.error('Error updating treatment:', error);
      toast({
        title: "Hata",
        description: "Tedavi güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useToggleTreatmentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { data, error } = await supabase
        .from('treatments')
        .update({ active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Başarılı",
        description: variables.active ? "Tedavi aktif edildi" : "Tedavi pasif edildi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      console.error('Error toggling treatment status:', error);
      toast({
        title: "Hata",
        description: "Tedavi durumu değiştirilirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (treatmentId: string) => {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', treatmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Tedavi silindi",
      });

      queryClient.invalidateQueries({ queryKey: ['clinic-treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      console.error('Error deleting treatment:', error);
      toast({
        title: "Hata",
        description: "Tedavi silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });
};
