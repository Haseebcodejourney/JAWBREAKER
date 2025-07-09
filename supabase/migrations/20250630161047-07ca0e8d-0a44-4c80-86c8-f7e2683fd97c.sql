
-- Add missing essential tables for comprehensive medical tourism platform

-- Doctor profiles table
CREATE TABLE public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT, -- Dr., Prof., etc.
  specialization TEXT NOT NULL,
  education TEXT[],
  certifications TEXT[],
  years_experience INTEGER,
  bio TEXT,
  profile_image_url TEXT,
  languages TEXT[] DEFAULT ARRAY['en'],
  consultation_fee DECIMAL(10,2),
  available_online BOOLEAN DEFAULT FALSE,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic facilities and amenities
CREATE TABLE public.clinic_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  facility_type TEXT NOT NULL, -- 'amenity', 'equipment', 'service'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment packages
CREATE TABLE public.treatment_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  package_type TEXT NOT NULL, -- 'standard', 'vip', 'all_inclusive', 'family'
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  includes TEXT[],
  excludes TEXT[],
  duration_days INTEGER,
  max_participants INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dynamic pricing and campaigns
CREATE TABLE public.price_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  conditions JSONB, -- booking conditions, minimum stay, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical forms and patient intake
CREATE TABLE public.medical_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatments(id),
  form_name TEXT NOT NULL,
  form_fields JSONB NOT NULL, -- dynamic form structure
  is_required BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient form submissions
CREATE TABLE public.patient_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  form_id UUID REFERENCES public.medical_forms(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' -- 'pending', 'reviewed', 'approved', 'rejected'
);

-- Travel and accommodation services
CREATE TABLE public.travel_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'hotel', 'transfer', 'flight', 'visa_assistance'
  provider_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  booking_url TEXT,
  contact_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance and payment partners
CREATE TABLE public.insurance_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_type TEXT NOT NULL, -- 'insurance', 'payment', 'financing'
  coverage_details TEXT,
  contact_info JSONB,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate and referral program
CREATE TABLE public.affiliate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  commission_type TEXT NOT NULL, -- 'percentage', 'fixed'
  commission_value DECIMAL(10,2) NOT NULL,
  minimum_payout DECIMAL(10,2) DEFAULT 100,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate tracking
CREATE TABLE public.affiliate_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.affiliate_programs(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  commission_earned DECIMAL(10,2),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid'
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Audit log for compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS coordinates POINT;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS working_hours JSONB;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS transfer_services BOOLEAN DEFAULT FALSE;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS hotel_partnerships BOOLEAN DEFAULT FALSE;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS insurance_accepted TEXT[];
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS video_tour_url TEXT;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;

-- Add success rate and enhanced fields to treatments
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2);
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS procedure_steps TEXT[];
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS prerequisites TEXT[];
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS recovery_instructions TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS before_after_gallery TEXT[];
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS assigned_doctor_id UUID REFERENCES public.doctor_profiles(id);

-- Add multi-currency support to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10,4);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS original_currency TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS travel_package_id UUID;

-- Add GDPR compliance fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gdpr_consent_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_retention_period INTEGER DEFAULT 2555; -- 7 years in days

-- Enable RLS on new tables
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
-- Doctor profiles - public read, clinic owners can manage
CREATE POLICY "Anyone can view doctor profiles" ON public.doctor_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Clinic owners can manage doctor profiles" ON public.doctor_profiles
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Clinic facilities - public read, clinic owners can manage
CREATE POLICY "Anyone can view clinic facilities" ON public.clinic_facilities
  FOR SELECT USING (TRUE);

CREATE POLICY "Clinic owners can manage facilities" ON public.clinic_facilities
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Treatment packages - public read, clinic owners can manage
CREATE POLICY "Anyone can view active treatment packages" ON public.treatment_packages
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Clinic owners can manage treatment packages" ON public.treatment_packages
  FOR ALL USING (
    treatment_id IN (
      SELECT t.id FROM public.treatments t 
      JOIN public.clinics c ON t.clinic_id = c.id 
      WHERE c.owner_id = auth.uid()
    )
  );

-- Price campaigns - public read active campaigns, clinic owners can manage
CREATE POLICY "Anyone can view active price campaigns" ON public.price_campaigns
  FOR SELECT USING (is_active = TRUE AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Clinic owners can manage price campaigns" ON public.price_campaigns
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Medical forms - patients and clinic owners can view/manage
CREATE POLICY "Clinic owners can manage medical forms" ON public.medical_forms
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Patient form submissions - patients can manage their own, clinics can view related
CREATE POLICY "Patients can manage their form submissions" ON public.patient_form_submissions
  FOR ALL USING (patient_id = auth.uid());

CREATE POLICY "Clinic owners can view form submissions" ON public.patient_form_submissions
  FOR SELECT USING (
    form_id IN (
      SELECT mf.id FROM public.medical_forms mf
      JOIN public.clinics c ON mf.clinic_id = c.id
      WHERE c.owner_id = auth.uid()
    )
  );

-- Travel services - public read, clinic owners can manage
CREATE POLICY "Anyone can view active travel services" ON public.travel_services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Clinic owners can manage travel services" ON public.travel_services
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Insurance partners - public read, clinic owners can manage
CREATE POLICY "Anyone can view active insurance partners" ON public.insurance_partners
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Clinic owners can manage insurance partners" ON public.insurance_partners
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Affiliate programs - clinic owners can manage
CREATE POLICY "Clinic owners can manage affiliate programs" ON public.affiliate_programs
  FOR ALL USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

-- Affiliate tracking - affiliates can view their own, clinic owners can view their programs
CREATE POLICY "Affiliates can view their tracking" ON public.affiliate_tracking
  FOR SELECT USING (affiliate_id = auth.uid());

CREATE POLICY "Clinic owners can view affiliate tracking" ON public.affiliate_tracking
  FOR SELECT USING (
    program_id IN (
      SELECT ap.id FROM public.affiliate_programs ap
      JOIN public.clinics c ON ap.clinic_id = c.id
      WHERE c.owner_id = auth.uid()
    )
  );

-- Audit logs - only admins can view
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_clinic_id ON public.doctor_profiles(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_facilities_clinic_id ON public.clinic_facilities(clinic_id);
CREATE INDEX IF NOT EXISTS idx_treatment_packages_treatment_id ON public.treatment_packages(treatment_id);
CREATE INDEX IF NOT EXISTS idx_price_campaigns_dates ON public.price_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_medical_forms_clinic_treatment ON public.medical_forms(clinic_id, treatment_id);
CREATE INDEX IF NOT EXISTS idx_patient_submissions_patient_id ON public.patient_form_submissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_travel_services_clinic_type ON public.travel_services(clinic_id, service_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_clinics_coordinates ON public.clinics USING GIST(coordinates);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
