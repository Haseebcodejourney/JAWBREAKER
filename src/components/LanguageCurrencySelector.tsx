
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageCurrencySelectorProps {
  currentLang?: string;
  currentCurrency?: string;
  onLanguageChange?: (lang: string) => void;
  onCurrencyChange?: (currency: string) => void;
}

const LanguageCurrencySelector = ({
  currentLang,
  currentCurrency,
  onLanguageChange,
  onCurrencyChange
}: LanguageCurrencySelectorProps) => {
  const { language, currency, setLanguage, setCurrency, availableLanguages, isAdmin } = useLanguage();
  
  // Props'dan gelen değerleri kullan, yoksa context'ten al
  const activeLang = currentLang || language;
  const activeCurrency = currentCurrency || currency;
  const handleLangChange = onLanguageChange || setLanguage;
  const handleCurrencyChange = onCurrencyChange || setCurrency;

  const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'AED'];

  // Sistem dili zorlaması kontrolü
  const isLanguageForced = localStorage.getItem('force-system-language') === 'true';
  const isLanguageDisabled = isLanguageForced && !isAdmin;

  return (
    <div className="hidden sm:flex items-center space-x-2">
      <select 
        value={activeLang} 
        onChange={(e) => handleLangChange(e.target.value)}
        disabled={isLanguageDisabled}
        className={`text-sm border-none bg-transparent focus:outline-none cursor-pointer ${isLanguageDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.code.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="text-gray-300">|</span>
      <select 
        value={activeCurrency} 
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
      >
        {currencies.map(curr => (
          <option key={curr} value={curr}>{curr}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageCurrencySelector;
