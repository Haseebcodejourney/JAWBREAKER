
-- Demo data for admin panel functionality

-- Insert demo pending clinics
INSERT INTO public.clinics (
  name, city, country, email, phone, address, description, website,
  status, verified, featured, established_year, staff_count,
  accreditations, specialties
) VALUES 
(
  'Ankara Medical Center',
  'Ankara',
  'Turkey',
  'info@ankaramedical.com',
  '+90 312 555 0123',
  'Çankaya, Ankara Merkez, Turkey',
  'Modern medical facility specializing in cosmetic and reconstructive surgery with international standards.',
  'https://ankaramedical.com',
  'pending',
  false,
  false,
  2015,
  25,
  ARRAY['JCI Accredited', 'ISO 9001:2015', 'Turkish Ministry of Health'],
  ARRAY['Plastic Surgery', 'Dermatology', 'Hair Transplant']
),
(
  'Bursa Dental Excellence',
  'Bursa',
  'Turkey', 
  'contact@bursadental.com',
  '+90 224 555 0456',
  'Nilüfer, Bursa, Turkey',
  'Leading dental clinic offering comprehensive dental treatments and smile makeovers.',
  'https://bursadental.com',
  'pending',
  false,
  false,
  2018,
  15,
  ARRAY['Turkish Dental Association', 'ISO 13485'],
  ARRAY['Dental Implants', 'Orthodontics', 'Cosmetic Dentistry']
),
(
  'Istanbul Eye Care Institute',
  'Istanbul',
  'Turkey',
  'hello@istanbuleyecare.com',
  '+90 212 555 0789',
  'Şişli, Istanbul, Turkey',
  'Specialized eye care center with advanced laser surgery capabilities.',
  'https://istanbuleyecare.com',
  'pending',
  false,
  false,
  2020,
  18,
  ARRAY['International Council of Ophthalmology', 'Turkish Ophthalmology Society'],
  ARRAY['LASIK Surgery', 'Cataract Surgery', 'Retinal Surgery']
);

-- Insert demo documents for pending review
INSERT INTO public.documents (
  owner_id, clinic_id, document_type, file_name, file_url, mime_type, file_size, verified
) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  (SELECT id FROM public.clinics WHERE name = 'Ankara Medical Center'),
  'Medical License',
  'medical_license_ankara.pdf',
  'https://example.com/documents/medical_license_ankara.pdf',
  'application/pdf',
  2048576,
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  (SELECT id FROM public.clinics WHERE name = 'Bursa Dental Excellence'),
  'Insurance Certificate',
  'insurance_cert_bursa.pdf',
  'https://example.com/documents/insurance_cert_bursa.pdf',
  'application/pdf',
  1536000,
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  (SELECT id FROM public.clinics WHERE name = 'Istanbul Eye Care Institute'),
  'Accreditation Certificate',
  'accreditation_istanbul.pdf',
  'https://example.com/documents/accreditation_istanbul.pdf',
  'application/pdf',
  3072000,
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  (SELECT id FROM public.clinics WHERE name = 'Ankara Medical Center'),
  'Staff Certificates',
  'staff_certs_ankara.pdf',
  'https://example.com/documents/staff_certs_ankara.pdf',
  'application/pdf',
  4096000,
  false
);

-- Insert demo treatments for pending approval
INSERT INTO public.treatments (
  name, description, category, clinic_id, price_from, price_to, 
  duration_days, recovery_days, currency, active
) VALUES
(
  'Advanced Hair Transplant FUE',
  'State-of-the-art Follicular Unit Extraction hair transplant procedure with natural results.',
  'hair_transplant',
  (SELECT id FROM public.clinics WHERE name = 'Ankara Medical Center'),
  1500,
  3500,
  1,
  7,
  'EUR',
  false
),
(
  'All-on-4 Dental Implants',
  'Complete mouth restoration using 4 strategically placed dental implants.',
  'dental',
  (SELECT id FROM public.clinics WHERE name = 'Bursa Dental Excellence'),
  4000,
  8000,
  3,
  14,
  'EUR',
  false
),
(
  'LASIK Eye Surgery Premium',
  'Advanced laser eye surgery for vision correction with latest technology.',
  'eye_surgery',
  (SELECT id FROM public.clinics WHERE name = 'Istanbul Eye Care Institute'),
  800,
  1500,
  1,
  3,
  'EUR',
  false
);

-- Insert demo notifications for admin
INSERT INTO public.notifications (
  user_id, title, message, type, action_url, read
) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  'New Clinic Application',
  'Ankara Medical Center has submitted their application for review.',
  'info',
  '/admin/approvals',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  'Document Verification Required',
  'Medical license document from Bursa Dental Excellence needs verification.',
  'warning',
  '/admin/approvals',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'deniz@dxdglobal.com'),
  'Treatment Approval Pending',
  'LASIK Eye Surgery treatment requires approval before going live.',
  'info',
  '/admin/approvals',
  false
);
