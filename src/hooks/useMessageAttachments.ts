
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const useMessageAttachments = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAttachment = async (file: File, messageId: string): Promise<Attachment | null> => {
    setUploading(true);
    
    try {
      // Create attachment record
      const { data: attachment, error } = await supabase
        .from('message_attachments')
        .insert({
          message_id: messageId,
          file_name: file.name,
          file_url: `placeholder-${Date.now()}`, // This would be storage URL in real implementation
          file_type: file.type,
          file_size: file.size
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Dosya yüklendi",
        description: "Dosya başarıyla gönderildi."
      });

      return attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Hata",
        description: "Dosya yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getAttachments = async (messageId: string): Promise<Attachment[]> => {
    try {
      const { data, error } = await supabase
        .from('message_attachments')
        .select('*')
        .eq('message_id', messageId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  };

  return {
    uploading,
    uploadAttachment,
    getAttachments
  };
};
