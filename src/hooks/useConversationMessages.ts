
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface MessageAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  message_type: string;
  sender_type: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  attachments?: MessageAttachment[];
}

export const useConversationMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Then get the sender profiles and attachments for each message
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', message.sender_id)
            .single();

          // Get attachments for this message
          const { data: attachmentsData } = await supabase
            .from('message_attachments')
            .select('id, file_name, file_url, file_type, file_size')
            .eq('message_id', message.id);

          return {
            ...message,
            sender: senderData || undefined,
            attachments: attachmentsData || []
          } as Message;
        })
      );

      return messagesWithSenders;
    },
    enabled: !!conversationId,
  });

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          // Refetch messages when changes occur
          queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return {
    messages: messages || [],
    isLoading,
    error
  };
};
