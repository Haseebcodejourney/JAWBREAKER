
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface ConversationData {
  id: string;
  patient: string;
  clinic: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: string;
  priority?: string;
  tags?: string[];
}

export const useAdminConversations = () => {
  const queryClient = useQueryClient();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: async () => {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          subject,
          status,
          priority,
          tags,
          created_at,
          updated_at,
          last_message_at,
          booking_id,
          patient_id,
          clinic_id
        `)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Her conversation için patient ve clinic bilgilerini al
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          // Patient bilgisi
          const { data: patientData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', conversation.patient_id)
            .single();

          // Clinic bilgisi
          const { data: clinicData } = await supabase
            .from('clinics')
            .select('name')
            .eq('id', conversation.clinic_id)
            .single();

          // Son mesajı al
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Okunmamış mesaj sayısını al
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .is('read_at', null);

          return {
            id: conversation.id,
            patient: patientData ? `${patientData.first_name} ${patientData.last_name}` : 'Bilinmeyen Hasta',
            clinic: clinicData?.name || 'Bilinmeyen Klinik',
            subject: conversation.subject || 'Konu Belirtilmemiş',
            lastMessage: lastMessageData?.content || 'Henüz mesaj yok',
            timestamp: lastMessageData ? formatTimestamp(lastMessageData.created_at) : formatTimestamp(conversation.created_at),
            unreadCount: unreadCount || 0,
            status: conversation.status || 'active',
            priority: conversation.priority || 'normal',
            tags: conversation.tags || []
          } as ConversationData;
        })
      );

      return conversationsWithDetails;
    },
  });

  // Set up real-time subscription for conversations
  useEffect(() => {
    const channel = supabase
      .channel('admin-conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // Refetch conversations when changes occur
          queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    conversations: conversations || [],
    isLoading,
    error
  };
};

// Zaman formatı helper function
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Az önce';
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} gün önce`;
  }
};
