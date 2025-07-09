
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
}

interface AdminMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const AdminMessageList: React.FC<AdminMessageListProps> = ({
  messages,
  isLoading
}) => {
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
    if (!sender) return 'Bilinmeyen Kullanıcı';
    return `${sender.first_name} ${sender.last_name}`.trim() || 'İsimsiz Kullanıcı';
  };

  const getSenderTypeInfo = (senderType: string) => {
    switch (senderType) {
      case 'patient':
        return { label: 'Hasta', color: 'bg-blue-100 text-blue-800' };
      case 'clinic':
        return { label: 'Klinik', color: 'bg-green-100 text-green-800' };
      case 'admin':
        return { label: 'Sistem', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Kullanıcı', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getMessageStyle = (senderType: string) => {
    switch (senderType) {
      case 'admin':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'clinic':
        return 'bg-green-50';
      case 'patient':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Mesajlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Bu konuşmada henüz mesaj bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
      {messages.map((message) => {
        const senderTypeInfo = getSenderTypeInfo(message.sender_type);
        
        return (
          <div key={message.id} className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender?.avatar_url} />
              <AvatarFallback className="text-xs">
                {getSenderName(message.sender).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {message.sender_type === 'admin' ? 'Sistem Mesajı' : getSenderName(message.sender)}
                </span>
                <Badge className={senderTypeInfo.color}>
                  {senderTypeInfo.label}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTime(message.created_at)}
                </span>
                {!message.read_at && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              
              <div className={`rounded-lg px-3 py-2 ${getMessageStyle(message.sender_type)}`}>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
