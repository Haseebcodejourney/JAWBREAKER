
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, DollarSign, Lock } from 'lucide-react';

const UnifiedLanguageCurrencySelector = () => {
  const { language, currency, setLanguage, setCurrency, availableLanguages, isAdmin } = useLanguage();

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
  ];

  // Sistem dili zorlaması kontrolü
  const isLanguageForced = localStorage.getItem('force-system-language') === 'true';
  const isLanguageDisabled = isLanguageForced && !isAdmin;

  return (
    <div className="hidden sm:flex items-center space-x-3">
      {/* Language Selector */}
      <div className="flex items-center space-x-1">
        <Globe className="w-4 h-4 text-gray-600" />
        <Select 
          value={language} 
          onValueChange={setLanguage}
          disabled={isLanguageDisabled}
        >
          <SelectTrigger className={`w-20 h-8 text-sm border-none bg-transparent ${isLanguageDisabled ? 'opacity-50' : ''}`}>
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

      <span className="text-gray-300">|</span>

      {/* Currency Selector */}
      <div className="flex items-center space-x-1">
        <DollarSign className="w-4 h-4 text-gray-600" />
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-16 h-8 text-sm border-none bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(curr => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center space-x-1">
                  <span>{curr.symbol}</span>
                  <span>{curr.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UnifiedLanguageCurrencySelector;
