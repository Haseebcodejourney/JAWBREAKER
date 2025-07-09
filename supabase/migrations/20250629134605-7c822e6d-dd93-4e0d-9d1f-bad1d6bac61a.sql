
-- Admin kullanıcısının rolünü güncelle
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@JAW BREAKER.com';
