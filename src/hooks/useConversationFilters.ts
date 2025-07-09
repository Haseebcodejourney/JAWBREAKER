
import { useState, useMemo } from 'react';

interface ConversationFilters {
  search: string;
  status: string;
  priority: string;
  tags: string[];
}

interface Conversation {
  id: string;
  patient: string;
  clinic: string;
  subject: string;
  lastMessage: string;
  status: string;
  priority?: string;
  tags?: string[];
  unreadCount: number;
  timestamp: string;
}

export const useConversationFilters = (conversations: Conversation[]) => {
  const [filters, setFilters] = useState<ConversationFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    tags: []
  });

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          conversation.patient.toLowerCase().includes(searchLower) ||
          conversation.clinic.toLowerCase().includes(searchLower) ||
          conversation.subject.toLowerCase().includes(searchLower) ||
          conversation.lastMessage.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && conversation.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && conversation.priority !== filters.priority) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const conversationTags = conversation.tags || [];
        const hasMatchingTag = filters.tags.some(tag => 
          conversationTags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [conversations, filters]);

  const updateFilters = (newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      tags: []
    });
  };

  return {
    filters,
    filteredConversations,
    updateFilters,
    clearFilters
  };
};
