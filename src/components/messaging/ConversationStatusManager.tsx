
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Tag, Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConversationStatusManagerProps {
  conversation: {
    id: string;
    status: string;
    priority?: string;
    tags?: string[];
    assigned_to?: string;
  };
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onTagsChange: (tags: string[]) => void;
  onAssigneeChange: (assignee: string) => void;
}

export const ConversationStatusManager: React.FC<ConversationStatusManagerProps> = ({
  conversation,
  onStatusChange,
  onPriorityChange,
  onTagsChange,
  onAssigneeChange
}) => {
  const { t } = useLanguage();
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = conversation.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        onTagsChange([...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = conversation.tags || [];
    onTagsChange(currentTags.filter(tag => tag !== tagToRemove));
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4 p-4 border-b bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {t('messaging.status')}
          </label>
          <Select value={conversation.status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="resolved">{t('status.resolved')}</SelectItem>
              <SelectItem value="closed">{t('status.closed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {t('messaging.priority')}
          </label>
          <Select value={conversation.priority || 'normal'} onValueChange={onPriorityChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t('priority.low')}</SelectItem>
              <SelectItem value="normal">{t('priority.normal')}</SelectItem>
              <SelectItem value="high">{t('priority.high')}</SelectItem>
              <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(conversation.status)}>
          {t(`status.${conversation.status}`)}
        </Badge>
        <Badge className={getPriorityColor(conversation.priority)}>
          <Flag className="w-3 h-3 mr-1" />
          {t(`priority.${conversation.priority || 'normal'}`)}
        </Badge>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          <Tag className="w-4 h-4 inline mr-1" />
          {t('messaging.tags')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {conversation.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={t('messaging.tags')}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1"
          />
          <Button onClick={handleAddTag} size="sm">
            {t('common.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};
