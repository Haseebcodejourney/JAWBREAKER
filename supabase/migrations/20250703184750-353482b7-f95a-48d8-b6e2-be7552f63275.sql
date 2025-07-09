
-- Clear existing demo data and add comprehensive demo data with images

-- Update existing clinics with proper images and make them editable
UPDATE public.clinics SET 
  cover_image_url = CASE 
    WHEN name LIKE '%Hair%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
    WHEN name LIKE '%Dental%' THEN 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=400&fit=crop'
    WHEN name LIKE '%Beauty%' OR name LIKE '%Cosmetic%' THEN 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop'
    WHEN name LIKE '%Eye%' THEN 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=800&h=400&fit=crop'
  END,
  logo_url = CASE 
    WHEN name LIKE '%Hair%' THEN 'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=200&h=200&fit=crop'
    WHEN name LIKE '%Dental%' THEN 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=200&fit=crop'
    WHEN name LIKE '%Beauty%' OR name LIKE '%Cosmetic%' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'
    WHEN name LIKE '%Eye%' THEN 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&h=200&fit=crop'
  END
WHERE cover_image_url IS NULL OR logo_url IS NULL;

-- Update all treatments with proper images
UPDATE public.treatments SET 
  images = CASE 
    WHEN category = 'hair_transplant' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=400&fit=crop'
      ]
    WHEN category = 'dental' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop'
      ]
    WHEN category = 'cosmetic_surgery' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop'
      ]
    WHEN category = 'eye_surgery' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&h=400&fit=crop'
      ]
    WHEN category = 'orthopedic' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
      ]
    WHEN category = 'cardiology' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop'
      ]
    WHEN category = 'fertility' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
      ]
    ELSE 
      ARRAY[
        'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop'
      ]
  END,
  before_after_gallery = CASE 
    WHEN category = 'hair_transplant' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=400&h=300&fit=crop'
      ]
    WHEN category = 'dental' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop'
      ]
    WHEN category = 'cosmetic_surgery' THEN 
      ARRAY[
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      ]
    ELSE 
      ARRAY[
        'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
      ]
  END
WHERE images IS NULL OR array_length(images, 1) IS NULL;

-- Update doctor profiles with images
UPDATE public.doctor_profiles SET 
  profile_image_url = CASE 
    WHEN specialization LIKE '%Hair%' THEN 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
    WHEN specialization LIKE '%Dental%' OR specialization LIKE '%Oral%' THEN 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
    WHEN specialization LIKE '%Plastic%' OR specialization LIKE '%Cosmetic%' THEN 'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=300&h=300&fit=crop&crop=face'
    WHEN specialization LIKE '%Eye%' OR specialization LIKE '%Ophthalmology%' THEN 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face'
    ELSE 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
  END
WHERE profile_image_url IS NULL;

-- Add more demo clinics with complete data and images
INSERT INTO public.clinics (
  name, city, country, description, email, phone, address,
  status, established_year, staff_count, rating, review_count,
  verified, featured, specialties, languages, owner_id,
  cover_image_url, logo_url, website
) VALUES 
(
  'Izmir Cosmetic Surgery Center',
  'Izmir',
  'Turkey',
  'Premier cosmetic surgery center offering world-class aesthetic procedures with internationally trained surgeons.',
  'info@izmircosmetic.com',
  '+90 232 555 0111',
  'Alsancak, Kordon Boyu No:85, Izmir',
  'approved',
  2010,
  32,
  4.9,
  178,
  true,
  true,
  ARRAY['cosmetic_surgery', 'rhinoplasty', 'breast_surgery', 'liposuction'],
  ARRAY['tr', 'en', 'de', 'fr'],
  (SELECT id FROM auth.users LIMIT 1),
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
  'https://izmircosmetic.com'
),
(
  'Bodrum Wellness & Surgery',
  'Bodrum',
  'Turkey',
  'Luxury medical tourism destination combining surgery with wellness and recovery in beautiful Bodrum.',
  'contact@bodrumwellness.com',
  '+90 252 555 0222',
  'Bodrum Marina, Neyzen Tevfik Cd. No:5, Bodrum',
  'approved',
  2016,
  28,
  4.7,
  145,
  true,
  false,
  ARRAY['cosmetic_surgery', 'hair_transplant', 'dental', 'wellness'],
  ARRAY['tr', 'en', 'ru', 'ar'],
  (SELECT id FROM auth.users LIMIT 1),
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&h=200&fit=crop',
  'https://bodrumwellness.com'
);

-- Add more demo treatments with complete data and images
INSERT INTO public.treatments (
  name, description, category, price_from, price_to, currency, duration_days, recovery_days, 
  clinic_id, features, included_services, images, before_after_gallery, active
) VALUES 
(
  'Premium Brazilian Butt Lift',
  'Advanced body contouring procedure using your own fat to enhance buttock shape and size naturally.',
  'cosmetic_surgery',
  4500, 7500, 'USD', 1, 21,
  (SELECT id FROM clinics WHERE name = 'Izmir Cosmetic Surgery Center' LIMIT 1),
  ARRAY['Own Fat Transfer', '360° Liposuction', 'Natural Results', 'No Implants'],
  ARRAY['Pre-op Consultation', 'Surgery', '3D Body Scanning', 'Recovery Garments', 'Follow-up Care'],
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop'
  ],
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
  ],
  true
),
(
  'Sapphire FUE Hair Transplant',
  'Latest sapphire blade technology for natural hair restoration with minimal scarring and faster healing.',
  'hair_transplant',
  2200, 4800, 'USD', 2, 10,
  (SELECT id FROM clinics WHERE name = 'Bodrum Wellness & Surgery' LIMIT 1),
  ARRAY['Sapphire Blades', 'DHI Technique', 'PRP Treatment', 'Lifetime Guarantee'],
  ARRAY['Consultation', 'Hair Analysis', 'Surgery', 'PRP Session', 'Aftercare Kit', 'Hotel Package'],
  ARRAY[
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=400&fit=crop'
  ],
  ARRAY[
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=400&h=300&fit=crop'
  ],
  true
);

-- Add more demo doctor profiles with images
INSERT INTO public.doctor_profiles (
  first_name, last_name, title, specialization, bio, years_experience,
  education, certifications, languages, consultation_fee, available_online,
  clinic_id, profile_image_url
) VALUES
(
  'Elif',
  'Kaya',
  'Dr.',
  'Plastic and Reconstructive Surgeon',
  'Expert plastic surgeon specializing in facial aesthetics and body contouring with 15+ years of international experience.',
  15,
  ARRAY['Istanbul University Medical Faculty', 'Plastic Surgery Residency - UCLA'],
  ARRAY['Turkish Board of Plastic Surgery', 'American Board of Plastic Surgery', 'ISAPS Member'],
  ARRAY['tr', 'en', 'de'],
  180.00,
  true,
  (SELECT id FROM clinics WHERE name = 'Izmir Cosmetic Surgery Center' LIMIT 1),
  'https://images.unsplash.com/photo-1594824389573-87d9fb5b5c46?w=300&h=300&fit=crop&crop=face'
),
(
  'Burak',
  'Özkan',
  'Prof. Dr.',
  'Hair Restoration Surgeon',
  'Leading hair transplant surgeon with innovative techniques and thousands of successful procedures worldwide.',
  20,
  ARRAY['Ankara University Medical Faculty', 'Hair Restoration Fellowship - New York'],
  ARRAY['ISHRS Certification', 'Turkish Dermatology Association', 'FUE Master Certification'],
  ARRAY['tr', 'en', 'ru', 'ar'],
  220.00,
  true,
  (SELECT id FROM clinics WHERE name = 'Bodrum Wellness & Surgery' LIMIT 1),
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
);

-- Update existing demo bookings with proper data
UPDATE public.bookings SET 
  notes = CASE 
    WHEN treatment_id IN (SELECT id FROM treatments WHERE category = 'hair_transplant') 
      THEN 'Patient interested in FUE technique, consultation completed, surgery scheduled'
    WHEN treatment_id IN (SELECT id FROM treatments WHERE category = 'dental') 
      THEN 'Full mouth restoration needed, treatment plan approved'
    WHEN treatment_id IN (SELECT id FROM treatments WHERE category = 'cosmetic_surgery') 
      THEN 'Rhinoplasty consultation completed, pre-op tests scheduled'
    ELSE 'General consultation and treatment planning'
  END,
  total_amount = CASE 
    WHEN total_amount IS NULL THEN 2500.00
    ELSE total_amount
  END
WHERE notes IS NULL OR notes = '';
