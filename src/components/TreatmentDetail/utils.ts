
export const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    hair_transplant: 'Saç Ekimi',
    dental: 'Diş Tedavisi',
    cosmetic_surgery: 'Estetik Cerrahi',
    eye_surgery: 'Göz Ameliyatı',
    orthopedic: 'Ortopedi',
    cardiology: 'Kardiyoloji',
    fertility: 'Fertilite',
    bariatric_surgery: 'Bariatrik Cerrahi',
    oncology: 'Onkoloji',
    other: 'Diğer'
  };
  return labels[category] || category;
};

export const getCategoryColor = (category: string) => {
  const colors = {
    'hair_transplant': 'bg-blue-100 text-blue-800',
    'dental': 'bg-green-100 text-green-800',
    'cosmetic_surgery': 'bg-purple-100 text-purple-800',
    'eye_surgery': 'bg-orange-100 text-orange-800',
    'orthopedic': 'bg-red-100 text-red-800',
    'fertility': 'bg-pink-100 text-pink-800',
    'cardiology': 'bg-indigo-100 text-indigo-800',
    'bariatric_surgery': 'bg-yellow-100 text-yellow-800',
    'oncology': 'bg-gray-100 text-gray-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  return colors[category as keyof typeof colors] || colors.other;
};

export const formatPrice = (from: number, to: number, currency: string) => {
  if (from === to) return `${currency} ${from.toLocaleString()}`;
  return `${currency} ${from.toLocaleString()} - ${to.toLocaleString()}`;
};

export const getDiscountedPrice = (treatment: any, activeCampaign: any) => {
  if (!activeCampaign || !treatment.price_from) return null;
  
  let discountedPrice = treatment.price_from;
  
  if (activeCampaign.discount_percentage) {
    discountedPrice = treatment.price_from * (1 - activeCampaign.discount_percentage / 100);
  } else if (activeCampaign.discount_amount) {
    discountedPrice = treatment.price_from - activeCampaign.discount_amount;
  }
  
  return Math.max(0, discountedPrice);
};
