
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, AlertCircle } from 'lucide-react';

interface AdminMessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  loading: boolean;
  disabled?: boolean;
}

export const AdminMessageInput: React.FC<AdminMessageInputProps> = ({
  onSendMessage,
  loading,
  disabled = false
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim() || loading || disabled) return;
    
    await onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-purple-50">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-purple-600" />
        <span className="text-xs text-purple-700 font-medium">
          Sistem mesajı olarak gönderilecek
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Sistem mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-purple-200 focus:border-purple-400"
          disabled={disabled || loading}
        />
        <Button 
          onClick={handleSend}
          disabled={loading || !newMessage.trim() || disabled}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
