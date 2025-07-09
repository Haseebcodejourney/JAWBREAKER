
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMessaging } from './messaging/useMessaging';
import { ConversationHeader } from './messaging/ConversationHeader';
import { MessageList } from './messaging/MessageList';
import { MessageInput } from './messaging/MessageInput';

interface MessagingSystemProps {
  bookingId?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({
  bookingId,
  receiverId,
  receiverName,
  receiverAvatar
}) => {
  const {
    messages,
    loading,
    sendMessage,
    messagesEndRef,
    user
  } = useMessaging({ bookingId, receiverId });

  return (
    <Card className="h-[600px] flex flex-col">
      <ConversationHeader 
        receiverName={receiverName}
        receiverAvatar={receiverAvatar}
      />

      <CardContent className="flex-1 flex flex-col p-0">
        <MessageList 
          messages={messages}
          currentUserId={user?.id}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput 
          onSendMessage={sendMessage}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default MessagingSystem;
