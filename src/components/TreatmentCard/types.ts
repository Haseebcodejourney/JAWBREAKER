
export interface Treatment {
  id: string;
  name: string;
  description: string;
  category: string;
  price_from: number;
  price_to: number;
  currency: string;
  duration_days: number;
  recovery_days: number;
  success_rate?: number;
  features: string[];
  images: string[];
  clinics: {
    id: string;
    name: string;
    city: string;
    country: string;
    rating: number;
    review_count: number;
  };
}

export interface PriceCampaign {
  id: string;
  campaign_name: string;
  discount_percentage: number;
  discount_amount: number;
}

export interface TreatmentPackage {
  id: string;
  name: string;
  package_type: string;
  price: number;
}
