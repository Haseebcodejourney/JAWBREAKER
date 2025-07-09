
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE user_role AS ENUM ('patient', 'clinic', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'disputed');
CREATE TYPE clinic_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'held', 'released', 'refunded');
CREATE TYPE treatment_category AS ENUM ('hair_transplant', 'dental', 'cosmetic_surgery', 'bariatric_surgery', 'orthopedic', 'cardiology', 'oncology', 'fertility', 'eye_surgery', 'other');

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'patient',
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics table
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  status clinic_status DEFAULT 'pending',
  languages TEXT[] DEFAULT ARRAY['en'],
  accreditations TEXT[],
  established_year INTEGER,
  staff_count INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatments table
CREATE TABLE public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category treatment_category NOT NULL,
  description TEXT,
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  duration_days INTEGER,
  recovery_days INTEGER,
  images TEXT[],
  features TEXT[],
  included_services TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'pending',
  preferred_date DATE,
  notes TEXT,
  total_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_status payment_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat functionality
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table for file uploads
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for clinics
CREATE POLICY "Anyone can view approved clinics" ON public.clinics
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Clinic owners can manage their clinics" ON public.clinics
  FOR ALL USING (owner_id = auth.uid());

-- RLS Policies for treatments
CREATE POLICY "Anyone can view active treatments" ON public.treatments
  FOR SELECT USING (active = true);

CREATE POLICY "Clinic owners can manage treatments" ON public.treatments
  FOR ALL USING (
    clinic_id IN (
      SELECT id FROM public.clinics WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for bookings
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

-- RLS Policies for reviews
CREATE POLICY "Anyone can view verified reviews" ON public.reviews
  FOR SELECT USING (verified = true AND moderated = true);

CREATE POLICY "Patients can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- RLS Policies for documents
CREATE POLICY "Users can view their documents" ON public.documents
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update clinic ratings
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE public.clinics 
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.reviews 
      WHERE clinic_id = NEW.clinic_id AND verified = true
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE clinic_id = NEW.clinic_id AND verified = true
    )
  WHERE id = NEW.clinic_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings when reviews are added/updated
CREATE TRIGGER update_clinic_rating_trigger
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_clinic_rating();
