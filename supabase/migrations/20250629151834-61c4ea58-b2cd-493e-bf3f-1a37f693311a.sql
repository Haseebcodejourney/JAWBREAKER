
-- Admin kullanıcısını manuel olarak kontrol et ve ekle
DO $$
BEGIN
  -- Admin kullanıcısının var olup olmadığını kontrol et
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@JAW BREAKER.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@JAW BREAKER.com',
      crypt('Admin123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"first_name": "Admin", "last_name": "User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Admin profilini oluştur/güncelle
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
  u.id, 
  u.email, 
  'Admin', 
  'User', 
  'admin'
FROM auth.users u
WHERE u.email = 'admin@JAW BREAKER.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id);

-- Mevcut admin profilini güncelle
UPDATE public.profiles 
SET role = 'admin', first_name = 'Admin', last_name = 'User', updated_at = NOW()
WHERE email = 'admin@JAW BREAKER.com';

-- RLS politikalarını temizle ve yeniden oluştur
-- Profiles tablosu
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clinics tablosu
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved clinics" ON public.clinics;
DROP POLICY IF EXISTS "Clinic owners can manage their clinics" ON public.clinics;
DROP POLICY IF EXISTS "Admins can manage all clinics" ON public.clinics;

CREATE POLICY "Anyone can view approved clinics" ON public.clinics
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Clinic owners can manage their clinics" ON public.clinics
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all clinics" ON public.clinics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Treatments tablosu
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active treatments" ON public.treatments;
DROP POLICY IF EXISTS "Clinic owners can manage treatments" ON public.treatments;
DROP POLICY IF EXISTS "Admins can manage all treatments" ON public.treatments;

CREATE POLICY "Anyone can view active treatments" ON public.treatments
  FOR SELECT USING (active = true);

CREATE POLICY "Clinic owners can manage treatments" ON public.treatments
  FOR ALL USING (
    clinic_id IN (
      SELECT id FROM public.clinics WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all treatments" ON public.treatments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookings tablosu
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Patients can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (
    patient_id = auth.uid() OR 
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

CREATE POLICY "Patients can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update their bookings" ON public.bookings
  FOR UPDATE USING (
    patient_id = auth.uid() OR 
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews tablosu
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view verified reviews" ON public.reviews;
DROP POLICY IF EXISTS "Patients can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;

CREATE POLICY "Anyone can view verified reviews" ON public.reviews
  FOR SELECT USING (verified = true AND moderated = true);

CREATE POLICY "Patients can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages tablosu
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;

CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Documents tablosu
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their documents" ON public.documents;
DROP POLICY IF EXISTS "Users can upload documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;

CREATE POLICY "Users can view their documents" ON public.documents
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can manage all documents" ON public.documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test clinic verileri ekle (sadece eğer mevcut değilse)
INSERT INTO public.clinics (name, country, city, description, status, owner_id)
SELECT 
  'Istanbul Medical Center',
  'Turkey',
  'Istanbul',
  'Leading medical tourism center specializing in hair transplant and cosmetic surgery.',
  'approved',
  p.id
FROM public.profiles p
WHERE p.email = 'admin@JAW BREAKER.com'
AND NOT EXISTS (SELECT 1 FROM public.clinics WHERE name = 'Istanbul Medical Center');

-- Diğer test clinics
INSERT INTO public.clinics (name, country, city, description, status)
SELECT 'Bangkok Dental Excellence', 'Thailand', 'Bangkok', 'Premium dental services with international standards.', 'approved'
WHERE NOT EXISTS (SELECT 1 FROM public.clinics WHERE name = 'Bangkok Dental Excellence');

INSERT INTO public.clinics (name, country, city, description, status) 
SELECT 'Vienna Aesthetic Clinic', 'Austria', 'Vienna', 'European excellence in cosmetic and reconstructive surgery.', 'pending'
WHERE NOT EXISTS (SELECT 1 FROM public.clinics WHERE name = 'Vienna Aesthetic Clinic');
