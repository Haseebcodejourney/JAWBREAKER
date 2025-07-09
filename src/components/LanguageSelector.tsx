
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Lock } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages, isAdmin } = useLanguage();

  // Sistem dili zorlaması kontrolü
  const isLanguageForced = localStorage.getItem('force-system-language') === 'true';
  const isLanguageDisabled = isLanguageForced && !isAdmin;

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Select 
        value={language} 
        onValueChange={setLanguage}
        disabled={isLanguageDisabled}
      >
        <SelectTrigger className={`w-20 h-8 text-xs ${isLanguageDisabled ? 'opacity-50' : ''}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLanguageDisabled && (
        <Lock className="w-3 h-3 text-gray-400" />
      )}
    </div>
  );
};

export default LanguageSelector;
