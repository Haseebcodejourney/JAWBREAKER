
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface UseMessagingProps {
  bookingId?: string;
  receiverId: string;
}

export const useMessaging = ({ bookingId, receiverId }: UseMessagingProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    if (!user) return;

    try {
      // First, try to find existing conversation
      let { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', user.id)
        .eq('clinic_id', receiverId)
        .eq('booking_id', bookingId || null)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingConversation) {
        setConversationId(existingConversation.id);
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            patient_id: user.id,
            clinic_id: receiverId,
            booking_id: bookingId || null,
            subject: bookingId ? 'Booking Discussion' : 'General Inquiry'
          })
          .select('id')
          .single();

        if (createError) throw createError;
        setConversationId(newConversation.id);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Then get the sender profiles for each message
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender: senderData || undefined
          };
        })
      );

      setMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !conversationId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          sender_id: user.id,
          conversation_id: conversationId,
          message_type: 'text'
        });

      if (error) throw error;
      
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user, receiverId, bookingId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messages,
    loading,
    sendMessage,
    messagesEndRef,
    user
  };
};
