import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminConversations } from '@/hooks/useAdminConversations';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { useConversationFilters } from '@/hooks/useConversationFilters';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ConversationHeader } from '@/components/messaging/ConversationHeader';
import { ConversationFilters } from '@/components/messaging/ConversationFilters';
import { EnhancedMessageList } from '@/components/messaging/EnhancedMessageList';
import { EnhancedMessageInput } from '@/components/messaging/EnhancedMessageInput';
import { TypingIndicator } from '@/components/messaging/TypingIndicator';
import { MessageCircle } from 'lucide-react';
import { ConversationStatusManager } from '@/components/messaging/ConversationStatusManager';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, isLoading: conversationsLoading, error } = useAdminConversations();
  const { messages, isLoading: messagesLoading } = useConversationMessages(selectedConversation?.id);
  const { filters, filteredConversations, updateFilters, clearFilters } = useConversationFilters(conversations);

  // Real-time typing indicators with presence - simplified approach
  useEffect(() => {
    if (!selectedConversation?.id || !user?.id) return;

    const typingChannel = supabase.channel(`typing-${selectedConversation.id}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = typingChannel.presenceState();
        console.log('Presence state:', newState);
        // For now, we'll use a simpler approach without complex presence parsing
        setTypingUsers([]);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await typingChannel.track({
            user_id: user.id,
            user_name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
            typing: false
          });
        }
      });

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [selectedConversation?.id, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (messageContent: string, attachments?: File[]) => {
    if (!selectedConversation || !user?.id) {
      toast({
        title: 'Error',
        description: 'Please select a conversation first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Generate tempId outside try block so it's accessible in catch
    const tempId = Math.random().toString(36).substring(7);

    try {
      // Optimistically update the messages list
      const newMessage = {
        id: tempId,
        content: messageContent,
        sender_id: user.id,
        conversation_id: selectedConversation.id,
        message_type: 'text',
        sender_type: 'admin',
        read_at: null,
        created_at: new Date().toISOString(),
        sender: {
          first_name: user.user_metadata?.first_name || 'Admin',
          last_name: user.user_metadata?.last_name || '',
          avatar_url: user.user_metadata?.avatar_url
        },
        attachments: []
      };

      queryClient.setQueryData(['conversation-messages', selectedConversation.id], (old: any) => {
        return [...(old || []), newMessage];
      });

      // Send the message to Supabase
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: messageContent,
            sender_id: user.id,
            conversation_id: selectedConversation.id,
            message_type: 'text',
            sender_type: 'admin'
          }
        ])
        .select('*')
        .single();

      if (messageError) {
        throw messageError;
      }

      // Handle attachments if any
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const filePath = `${selectedConversation.id}/${messageData.id}/${file.name}`;
          
          try {
            const { error: uploadError } = await supabase.storage
              .from('message-attachments')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error("Error uploading file:", uploadError);
              continue;
            }

            const { data: storageData } = supabase.storage
              .from('message-attachments')
              .getPublicUrl(filePath);

            const { error: attachmentError } = await supabase
              .from('message_attachments')
              .insert([
                {
                  message_id: messageData.id,
                  file_name: file.name,
                  file_url: storageData.publicUrl,
                  file_type: file.type,
                  file_size: file.size,
                }
              ]);

            if (attachmentError) {
              console.error("Error saving attachment metadata:", attachmentError);
            }
          } catch (error) {
            console.error("Attachment upload error:", error);
          }
        }
      }

      // Update conversation last message time
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', selectedConversation.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });

      toast({
        title: 'Success',
        description: 'Message sent successfully'
      });

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Revert optimistic update on error
      queryClient.setQueryData(['conversation-messages', selectedConversation.id], (old: any) => {
        return old?.filter((msg: any) => msg.id !== tempId);
      });

      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConversationStatus = async (status: string) => {
    if (!selectedConversation) return;

    try {
      // Optimistically update the conversation status
      queryClient.setQueryData(['admin-conversations'], (old: any) => {
        return old?.map((conversation: any) => {
          if (conversation.id === selectedConversation.id) {
            return { ...conversation, status: status };
          }
          return conversation;
        });
      });

      // Update the conversation status in Supabase
      const { error } = await supabase
        .from('conversations')
        .update({ status: status })
        .eq('id', selectedConversation.id);

      if (error) {
        throw error;
      }

      // Update selected conversation
      setSelectedConversation(prev => ({ ...prev, status }));

      toast({
        title: 'Success',
        description: 'Status updated successfully'
      });

    } catch (error) {
      console.error("Error updating conversation status:", error);
      
      // Revert optimistic update on error
      queryClient.setQueryData(['admin-conversations'], (old: any) => {
        return old?.map((conversation: any) => {
          if (conversation.id === selectedConversation.id) {
            return { ...conversation, status: selectedConversation.status };
          }
          return conversation;
        });
      });

      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateConversationPriority = async (priority: string) => {
    if (!selectedConversation) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ priority: priority })
        .eq('id', selectedConversation.id);

      if (error) throw error;

      setSelectedConversation(prev => ({ ...prev, priority }));
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });

      toast({
        title: 'Success',
        description: 'Priority updated successfully'
      });

    } catch (error) {
      console.error("Error updating conversation priority:", error);
      toast({
        title: 'Error',
        description: 'Failed to update priority',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateConversationTags = async (tags: string[]) => {
    if (!selectedConversation) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ tags: tags })
        .eq('id', selectedConversation.id);

      if (error) throw error;

      setSelectedConversation(prev => ({ ...prev, tags }));
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });

      toast({
        title: 'Success',
        description: 'Tags updated successfully'
      });

    } catch (error) {
      console.error("Error updating conversation tags:", error);
      toast({
        title: 'Error',
        description: 'Failed to update tags',
        variant: 'destructive'
      });
    }
  };

  const handleAssignConversation = async (assignee: string) => {
    if (!selectedConversation) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ assigned_to: assignee })
        .eq('id', selectedConversation.id);

      if (error) throw error;

      setSelectedConversation(prev => ({ ...prev, assigned_to: assignee }));
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });

      toast({
        title: 'Success',
        description: 'Assignee updated successfully'
      });

    } catch (error) {
      console.error("Error updating conversation assignee:", error);
      toast({
        title: 'Error',
        description: 'Failed to update assignee',
        variant: 'destructive'
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please login to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-64">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Messaging</h1>
              <p className="text-gray-600 mt-1">Manage conversations with patients</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-200px)] flex">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r flex flex-col">
              <ConversationFilters
                filters={filters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
              />
              
              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Loading...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    No conversations found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.patient}
                              </h3>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-1">
                              {conversation.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                                conversation.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {conversation.status}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                conversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                conversation.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {conversation.priority || 'normal'}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <ConversationHeader 
                    receiverName={selectedConversation.patient}
                    receiverAvatar={selectedConversation.avatar_url}
                  />
                  
                  <ConversationStatusManager
                    conversation={selectedConversation}
                    onStatusChange={handleUpdateConversationStatus}
                    onPriorityChange={handleUpdateConversationPriority}
                    onTagsChange={handleUpdateConversationTags}
                    onAssigneeChange={handleAssignConversation}
                  />
                  
                  <EnhancedMessageList
                    messages={messages}
                    conversationId={selectedConversation.id}
                    currentUserId={user?.id}
                    isLoading={messagesLoading}
                    messagesEndRef={messagesEndRef}
                  />
                  
                  <TypingIndicator typingUsers={typingUsers} />
                  
                  <EnhancedMessageInput
                    onSendMessage={handleSendMessage}
                    placeholder="Type your message..."
                    disabled={isLoading}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessaging;
