
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTypingIndicator = (conversationId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Update typing status
  const updateTypingStatus = async (typing: boolean) => {
    if (!conversationId || !user) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          is_typing: typing,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  // Listen for typing indicators
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`
        },
        async () => {
          // Fetch current typing users
          const { data } = await supabase
            .from('typing_indicators')
            .select('user_id, profiles(first_name, last_name)')
            .eq('conversation_id', conversationId)
            .eq('is_typing', true)
            .neq('user_id', user?.id || '');

          const typingUserNames = data?.map(item => 
            `${item.profiles?.first_name} ${item.profiles?.last_name}`.trim()
          ).filter(Boolean) || [];

          setTypingUsers(typingUserNames);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id]);

  return {
    typingUsers,
    isTyping,
    setIsTyping,
    updateTypingStatus
  };
};
