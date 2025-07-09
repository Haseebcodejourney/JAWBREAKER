
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConversationFiltersProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    tags: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const ConversationFilters: React.FC<ConversationFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const { t } = useLanguage();

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.tags.length > 0;

  return (
    <div className="space-y-4 p-4 border-b bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">{t('messaging.filters')}</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            {t('messaging.clearFilters')}
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('messaging.searchConversations')}
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder={t('messaging.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('status.all')}</SelectItem>
            <SelectItem value="active">{t('status.active')}</SelectItem>
            <SelectItem value="resolved">{t('status.resolved')}</SelectItem>
            <SelectItem value="closed">{t('status.closed')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => onFiltersChange({ priority: value })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder={t('messaging.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('status.all')}</SelectItem>
            <SelectItem value="low">{t('priority.low')}</SelectItem>
            <SelectItem value="normal">{t('priority.normal')}</SelectItem>
            <SelectItem value="high">{t('priority.high')}</SelectItem>
            <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          {t('messaging.filtersActive')}
        </div>
      )}
    </div>
  );
};
