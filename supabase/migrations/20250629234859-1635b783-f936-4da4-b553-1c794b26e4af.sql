
-- First, let's check the actual enum values and fix them
-- Looking at the types.ts file, the correct enum values are:
-- "hair_transplant", "dental", "cosmetic_surgery", "bariatric_surgery", "orthopedic", "cardiology", "oncology", "fertility", "eye_surgery", "other"

-- Insert treatments with correct enum values
INSERT INTO public.treatments (name, description, category, price_from, price_to, currency, duration_days, recovery_days, clinic_id, features, included_services, images) VALUES 
-- Hair Transplant treatments
('FUE Hair Transplant', 'Advanced Follicular Unit Extraction technique for natural-looking hair restoration', 'hair_transplant', 1500, 3500, 'USD', 1, 7, (SELECT id FROM clinics LIMIT 1), 
 ARRAY['Local Anesthesia', 'PRP Treatment', '12 Month Guarantee'], 
 ARRAY['Consultation', 'Surgery', 'Aftercare Kit', 'Follow-up'], 
 ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']),

('DHI Hair Transplant', 'Direct Hair Implantation with Choi Implanter Pen for maximum precision', 'hair_transplant', 2000, 4500, 'USD', 1, 10, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Choi Implanter', 'No Shaving Required', 'Lifetime Guarantee'],
 ARRAY['Consultation', 'Surgery', 'Medication', 'Hotel Transfer'],
 ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']),

-- Dental treatments
('Dental Implants', 'Titanium dental implants with crown for permanent tooth replacement', 'dental', 800, 2500, 'USD', 7, 14, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Titanium Implant', 'Porcelain Crown', '10 Year Warranty'],
 ARRAY['X-Ray', 'Surgery', 'Crown Fitting', 'Follow-up'],
 ARRAY['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop']),

('Porcelain Veneers', 'Custom-made porcelain veneers for perfect smile makeover', 'dental', 300, 800, 'USD', 3, 7, (SELECT id FROM clinics LIMIT 1),
 ARRAY['E-Max Porcelain', 'Custom Design', '15 Year Warranty'],
 ARRAY['Consultation', 'Teeth Preparation', 'Temporary Veneers', 'Final Fitting'],
 ARRAY['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop']),

-- Plastic Surgery treatments
('Rhinoplasty', 'Nose reshaping surgery for aesthetic and functional improvement', 'cosmetic_surgery', 2500, 5000, 'USD', 1, 14, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Ultrasonic Technique', 'Computer Simulation', 'Revision Guarantee'],
 ARRAY['Consultation', 'Surgery', 'Hospital Stay', 'Aftercare'],
 ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop']),

('Breast Augmentation', 'Breast enhancement with FDA-approved silicone implants', 'cosmetic_surgery', 3000, 6000, 'USD', 1, 21, (SELECT id FROM clinics LIMIT 1),
 ARRAY['FDA Approved Implants', 'Multiple Sizes', 'Lifetime Warranty'],
 ARRAY['Consultation', 'Surgery', 'Recovery Suite', 'Follow-up Care'],
 ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h-300&fit=crop']),

-- Eye Surgery treatments
('LASIK Surgery', 'Laser vision correction for myopia, hyperopia, and astigmatism', 'eye_surgery', 1000, 2500, 'USD', 1, 3, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Bladeless Technology', 'Wavefront Guided', 'Lifetime Enhancement'],
 ARRAY['Pre-Op Examination', 'Surgery', 'Post-Op Care', 'Enhancement Guarantee'],
 ARRAY['https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop']),

-- Orthopedic treatments
('Knee Replacement', 'Total knee joint replacement with titanium implants', 'orthopedic', 8000, 15000, 'USD', 3, 90, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Titanium Implants', 'Minimally Invasive', '20 Year Lifespan'],
 ARRAY['Pre-Op Tests', 'Surgery', 'Physical Therapy', 'Follow-up'],
 ARRAY['https://images.unsplash.com/photo-1551601651-767bb2180d49?w=400&h=300&fit=crop']),

-- Fertility treatments
('IVF Treatment', 'In Vitro Fertilization with advanced embryo selection', 'fertility', 3000, 8000, 'USD', 30, 0, (SELECT id FROM clinics LIMIT 1),
 ARRAY['ICSI Included', 'Embryo Freezing', 'Genetic Testing'],
 ARRAY['Consultation', 'Medication', 'Procedures', 'Monitoring'],
 ARRAY['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop']),

-- Cardiac treatments
('Heart Bypass Surgery', 'Coronary artery bypass grafting for heart disease treatment', 'cardiology', 15000, 30000, 'USD', 7, 42, (SELECT id FROM clinics LIMIT 1),
 ARRAY['Minimally Invasive', 'Robotic Assistance', 'ICU Care'],
 ARRAY['Pre-Op Tests', 'Surgery', 'ICU Stay', 'Rehabilitation'],
 ARRAY['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop']);

-- Update existing clinics to have more sample data if needed
UPDATE public.clinics 
SET 
  description = CASE 
    WHEN description IS NULL OR description = '' THEN 'Leading medical facility providing world-class healthcare services with international standards and experienced medical professionals.'
    ELSE description
  END,
  languages = ARRAY['en', 'tr', 'ar'],
  accreditations = ARRAY['JCI Accredited', 'ISO 9001', 'Ministry of Health Certified'],
  staff_count = 150,
  established_year = 2010,
  verified = true,
  featured = true
WHERE id IN (SELECT id FROM clinics LIMIT 3);
