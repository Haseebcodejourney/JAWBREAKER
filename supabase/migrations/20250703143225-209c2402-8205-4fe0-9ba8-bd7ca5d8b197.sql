
-- Demo klinikleri ekle
INSERT INTO public.clinics (
  id, name, city, country, description, email, phone, address,
  status, established_year, staff_count, rating, review_count,
  verified, featured, specialties, languages, owner_id
) VALUES 
(
  gen_random_uuid(),
  'Istanbul Hair Institute',
  'Istanbul',
  'Turkey',
  'Leading hair transplant clinic in Turkey with over 15 years of experience',
  'info@istanbulhair.com',
  '+90 212 555 0123',
  'Nisantasi, Tesvikiye Cd. No:123, Istanbul',
  'approved',
  2008,
  25,
  4.8,
  156,
  true,
  true,
  ARRAY['hair_transplant', 'fue', 'dhi'],
  ARRAY['tr', 'en', 'ar'],
  (SELECT id FROM auth.users LIMIT 1)
),
(
  gen_random_uuid(),
  'Acıbadem Beauty Center',
  'Istanbul',
  'Turkey', 
  'Premium cosmetic surgery and aesthetic treatments center',
  'info@acibadem-beauty.com',
  '+90 212 555 0456',
  'Etiler, Nispetiye Cd. No:45, Istanbul',
  'approved',
  2015,
  18,
  4.6,
  89,
  true,
  false,
  ARRAY['cosmetic_surgery', 'rhinoplasty', 'breast_augmentation'],
  ARRAY['tr', 'en'],
  (SELECT id FROM auth.users LIMIT 1)
),
(
  gen_random_uuid(),
  'Antalya Dental Excellence',
  'Antalya',
  'Turkey',
  'State-of-the-art dental clinic specializing in implants and veneers',
  'contact@antalyadental.com',
  '+90 242 555 0789',
  'Lara, Güzeloba Mah. 2308 Sk. No:12, Antalya',
  'approved',
  2012,
  12,
  4.7,
  234,
  true,
  true,
  ARRAY['dental_implants', 'veneers', 'orthodontics'],
  ARRAY['tr', 'en', 'de', 'ru'],
  (SELECT id FROM auth.users LIMIT 1)
);

-- Demo doktor profilleri ekle
INSERT INTO public.doctor_profiles (
  id, first_name, last_name, title, specialization,
  bio, years_experience, education, certifications,
  languages, consultation_fee, available_online,
  clinic_id
) VALUES
(
  gen_random_uuid(),
  'Mehmet',
  'Yılmaz',
  'Dr.',
  'Hair Transplant Surgeon',
  'Board-certified hair transplant surgeon with over 12 years of experience. Specializes in FUE and DHI techniques with natural-looking results.',
  12,
  ARRAY['Istanbul University Medical Faculty', 'Hair Transplant Fellowship - Johns Hopkins'],
  ARRAY['Turkish Board of Plastic Surgery', 'ISHRS Certification', 'FUE Certification'],
  ARRAY['tr', 'en', 'ar'],
  150.00,
  true,
  (SELECT id FROM clinics WHERE name = 'Istanbul Hair Institute' LIMIT 1)
),
(
  gen_random_uuid(),
  'Ayşe',
  'Demir',
  'Prof. Dr.',
  'Plastic Surgeon',
  'Renowned plastic surgeon specializing in facial aesthetics and body contouring. Published researcher with international recognition.',
  18,
  ARRAY['Hacettepe University Medical Faculty', 'Plastic Surgery Residency - Mayo Clinic'],
  ARRAY['Turkish Board of Plastic Surgery', 'European Board of Plastic Surgery'],
  ARRAY['tr', 'en'],
  200.00,
  true,
  (SELECT id FROM clinics WHERE name = 'Acıbadem Beauty Center' LIMIT 1)
),
(
  gen_random_uuid(),
  'Can',
  'Özkan',
  'Dr.',
  'Oral and Maxillofacial Surgeon',
  'Expert in dental implants and oral surgery with focus on minimally invasive techniques. Trained in latest implant technologies.',
  10,
  ARRAY['Marmara University Dentistry Faculty', 'Oral Surgery Specialization - University of Barcelona'],
  ARRAY['Turkish Dental Association', 'ITI Implant Certification'],
  ARRAY['tr', 'en', 'de'],
  120.00,
  false,
  (SELECT id FROM clinics WHERE name = 'Antalya Dental Excellence' LIMIT 1)
);

-- Demo bookings ekle
INSERT INTO public.bookings (
  id, patient_id, clinic_id, treatment_id, status, payment_status,
  preferred_date, total_amount, currency, notes, created_at
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  (SELECT id FROM clinics WHERE name = 'Istanbul Hair Institute' LIMIT 1),
  gen_random_uuid(),
  'confirmed',
  'paid',
  '2024-01-15',
  2500.00,
  'USD',
  'FUE hair transplant - 3000 grafts',
  NOW() - INTERVAL '5 days'
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  (SELECT id FROM clinics WHERE name = 'Acıbadem Beauty Center' LIMIT 1),
  gen_random_uuid(),
  'pending',
  'pending',
  '2024-02-20',
  1800.00,
  'USD',
  'Rhinoplasty consultation and procedure',
  NOW() - INTERVAL '2 days'
);

-- Demo mesajlar ekle
INSERT INTO public.conversations (
  id, patient_id, clinic_id, subject, status, created_at
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  (SELECT id FROM clinics WHERE name = 'Istanbul Hair Institute' LIMIT 1),
  'Hair Transplant Follow-up',
  'active',
  NOW() - INTERVAL '1 day'
);

INSERT INTO public.messages (
  id, conversation_id, sender_id, content, message_type, created_at
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM conversations ORDER BY created_at DESC LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Merhaba, saç ekimi sonrası kontrol için randevu almak istiyorum.',
  'text',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  (SELECT id FROM conversations ORDER BY created_at DESC LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Tabii ki! Size uygun bir tarih ayarlayalım. Hangi günler müsaitsiniz?',
  'text',
  NOW() - INTERVAL '23 hours'
);
