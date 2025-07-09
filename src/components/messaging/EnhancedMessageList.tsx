import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageAttachment } from './MessageAttachment';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  attachments?: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }>;
}

interface EnhancedMessageListProps {
  messages: Message[];
  conversationId: string | null;
  currentUserId?: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const EnhancedMessageList: React.FC<EnhancedMessageListProps> = ({
  messages,
  conversationId,
  currentUserId,
  isLoading,
  messagesEndRef
}) => {
  const { t } = useLanguage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderName = (sender?: { first_name: string; last_name: string }) => {
    if (!sender) return t('messaging.unknownUser');
    return `${sender.first_name} ${sender.last_name}`.trim() || t('messaging.unnamed');
  };

  const getSenderTypeInfo = (senderType: string) => {
    switch (senderType) {
      case 'patient':
        return { label: t('messaging.patient'), color: 'bg-blue-100 text-blue-800' };
      case 'clinic':
        return { label: t('messaging.clinic'), color: 'bg-green-100 text-green-800' };
      case 'admin':
        return { label: t('messaging.admin'), color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: t('messaging.user'), color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getMessageStatusIcon = (message: Message, isOwnMessage: boolean) => {
    if (!isOwnMessage) return null;
    
    if (message.read_at) {
      return (
        <div title={t('messaging.read')}>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      );
    }
    return (
      <div title={t('messaging.sent')}>
        <Clock className="w-4 h-4 text-gray-400" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">{t('messaging.loadingMessages')}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>{t('messaging.noMessages')}</p>
          <p className="text-sm mt-1">{t('messaging.startConversation')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message, index) => {
        const senderTypeInfo = getSenderTypeInfo(message.sender_type);
        const isOwnMessage = message.sender_id === currentUserId;
        const showDateSeparator = index === 0 || 
          new Date(message.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();
        
        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                  {new Date(message.created_at).toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            
            <div className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {!isOwnMessage && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={message.sender?.avatar_url} />
                  <AvatarFallback className="text-xs bg-gray-200">
                    {getSenderName(message.sender).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex-1 min-w-0 max-w-[70%] ${isOwnMessage ? 'flex flex-col items-end' : ''}`}>
                {!isOwnMessage && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender_type === 'admin' ? t('messaging.systemMessage') : getSenderName(message.sender)}
                    </span>
                    <Badge variant="secondary" className={`text-xs ${senderTypeInfo.color}`}>
                      {senderTypeInfo.label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.created_at)}
                    </span>
                    {!message.read_at && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                )}
                
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender_type === 'admin' 
                    ? 'bg-purple-50 border-l-4 border-purple-500 text-purple-900'
                    : isOwnMessage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map(attachment => (
                        <MessageAttachment
                          key={attachment.id}
                          fileName={attachment.file_name}
                          fileUrl={attachment.file_url}
                          fileType={attachment.file_type}
                          fileSize={attachment.file_size}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {isOwnMessage && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(message.created_at)}
                    </span>
                    {getMessageStatusIcon(message, isOwnMessage)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
