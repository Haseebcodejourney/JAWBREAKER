
-- Eksik RLS politikalarını ve güvenlik fonksiyonlarını oluştur

-- Güvenlik definer fonksiyonları
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Treatment packages için eksik RLS politikaları
DROP POLICY IF EXISTS "Users can create packages for their treatments" ON public.treatment_packages;
CREATE POLICY "Users can create packages for their treatments" 
ON public.treatment_packages 
FOR INSERT 
WITH CHECK (
  treatment_id IN (
    SELECT t.id FROM treatments t
    JOIN clinics c ON t.clinic_id = c.id
    WHERE c.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update packages for their treatments" ON public.treatment_packages;
CREATE POLICY "Users can update packages for their treatments" 
ON public.treatment_packages 
FOR UPDATE 
USING (
  treatment_id IN (
    SELECT t.id FROM treatments t
    JOIN clinics c ON t.clinic_id = c.id
    WHERE c.owner_id = auth.uid()
  )
);

-- Travel services için eksik politikalar
DROP POLICY IF EXISTS "Users can create travel services for their clinics" ON public.travel_services;
CREATE POLICY "Users can create travel services for their clinics" 
ON public.travel_services 
FOR INSERT 
WITH CHECK (
  clinic_id IN (
    SELECT id FROM clinics WHERE owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update travel services for their clinics" ON public.travel_services;
CREATE POLICY "Users can update travel services for their clinics" 
ON public.travel_services 
FOR UPDATE 
USING (
  clinic_id IN (
    SELECT id FROM clinics WHERE owner_id = auth.uid()
  )
);

-- Price campaigns için eksik politikalar
DROP POLICY IF EXISTS "Users can create campaigns for their clinics" ON public.price_campaigns;
CREATE POLICY "Users can create campaigns for their clinics" 
ON public.price_campaigns 
FOR INSERT 
WITH CHECK (
  clinic_id IN (
    SELECT id FROM clinics WHERE owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update campaigns for their clinics" ON public.price_campaigns;
CREATE POLICY "Users can update campaigns for their clinics" 
ON public.price_campaigns 
FOR UPDATE 
USING (
  clinic_id IN (
    SELECT id FROM clinics WHERE owner_id = auth.uid()
  )
);

-- Messages tablosuna DELETE politikası ekle
DROP POLICY IF EXISTS "Users can delete their messages" ON public.messages;
CREATE POLICY "Users can delete their messages" 
ON public.messages 
FOR DELETE 
USING (sender_id = auth.uid());

-- Reviews tablosuna UPDATE politikası ekle (sadece own reviews)
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (patient_id = auth.uid());

-- Bookings tablosuna DELETE politikası (sadece pending status)
DROP POLICY IF EXISTS "Users can cancel pending bookings" ON public.bookings;
CREATE POLICY "Users can cancel pending bookings" 
ON public.bookings 
FOR DELETE 
USING (
  patient_id = auth.uid() AND status = 'pending'
);

-- Rate limiting tablosu oluştur
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limits için RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- GDPR compliance tablosu
CREATE TABLE IF NOT EXISTS public.gdpr_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'marketing', 'analytics', 'cookies'
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  withdrawn_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR consents için RLS
ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consents" 
ON public.gdpr_consents 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own consents" 
ON public.gdpr_consents 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Admin/moderator role enum güncelle
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_new') THEN
    CREATE TYPE user_role_new AS ENUM ('patient', 'clinic', 'admin', 'moderator');
    
    -- Profiles tablosunda role column'unu güncelle
    ALTER TABLE public.profiles 
    ALTER COLUMN role TYPE user_role_new 
    USING role::text::user_role_new;
    
    -- Eski type'ı sil ve yeni type'ın adını değiştir
    DROP TYPE user_role;
    ALTER TYPE user_role_new RENAME TO user_role;
  END IF;
END $$;

-- Audit trigger'ları ekle
CREATE OR REPLACE FUNCTION public.audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kritik tablolara audit trigger ekle
DROP TRIGGER IF EXISTS audit_bookings ON public.bookings;
CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

DROP TRIGGER IF EXISTS audit_clinics ON public.clinics;
CREATE TRIGGER audit_clinics
  AFTER INSERT OR UPDATE OR DELETE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();
