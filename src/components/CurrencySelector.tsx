// import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign } from 'lucide-react';

// const CurrencySelector = () => {
//   const { currency, setCurrency } = useLanguage();

// //   const currencies = [
// //     { code: 'USD', name: 'US Dollar', symbol: '$' },
// //     { code: 'EUR', name: 'Euro', symbol: '€' },
// //     { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
// //     { code: 'GBP', name: 'British Pound', symbol: '£' },
// //     { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
// //   ];

//   return (
//     <div className="hidden sm:flex items-center space-x-1">
//       <DollarSign className="w-4 h-4 text-gray-600" />
//       <Select value={currency} onValueChange={setCurrency}>
//         <SelectTrigger className="w-16 h-8 text-sm border-none bg-transparent">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           {currencies.map(curr => (
//             <SelectItem key={curr.code} value={curr.code}>
//               <div className="flex items-center space-x-1">
//                 <span>{curr.symbol}</span>
//                 <span>{curr.code}</span>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

// export default CurrencySelector;
