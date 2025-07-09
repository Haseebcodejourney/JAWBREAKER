
-- Yeni admin kullanıcısını ekle
DO $$
BEGIN
  -- Admin kullanıcısının var olup olmadığını kontrol et
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'deniz@dxdglobal.com') THEN
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
      'deniz@dxdglobal.com',
      crypt('Admin123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"first_name": "Deniz", "last_name": "Admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Admin profilini oluştur
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
  u.id, 
  u.email, 
  'Deniz', 
  'Admin', 
  'admin'
FROM auth.users u
WHERE u.email = 'deniz@dxdglobal.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id);

-- Mevcut admin profilini güncelle (eğer varsa)
UPDATE public.profiles 
SET role = 'admin', first_name = 'Deniz', last_name = 'Admin', updated_at = NOW()
WHERE email = 'deniz@dxdglobal.com';
