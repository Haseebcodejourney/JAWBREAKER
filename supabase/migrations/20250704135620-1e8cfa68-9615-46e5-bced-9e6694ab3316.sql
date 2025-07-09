
-- Create site_settings table for global site configurations
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing site settings (anyone can view active settings)
CREATE POLICY "Anyone can view active site settings" 
  ON public.site_settings 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admins to manage site settings
CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ));

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category) VALUES
('site_title', 'JAW BREAKER', 'text', 'general'),
('site_description', 'Güvenilir medikal turizm platformu', 'text', 'general'),
('site_logo_url', '', 'text', 'general'),
('contact_email', 'info@IntelligentClinicalPlatform.com', 'email', 'contact'),
('contact_phone', '+90 548 831213 7', 'text', 'contact'),
('contact_address', 'İstanbul, Türkiye', 'textarea', 'contact'),
('social_facebook', '', 'text', 'social'),
('social_twitter', '', 'text', 'social'),
('social_instagram', '', 'text', 'social'),
('social_linkedin', '', 'text', 'social'),
('footer_text', '© 2024 JAW BREAKER. Tüm hakları saklıdır.', 'text', 'general');

-- Create menu_items table for navigation management
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  menu_type TEXT NOT NULL DEFAULT 'main',
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  target TEXT NOT NULL DEFAULT '_self',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing menu items (anyone can view active items)
CREATE POLICY "Anyone can view active menu items" 
  ON public.menu_items 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admins to manage menu items
CREATE POLICY "Admins can manage menu items" 
  ON public.menu_items 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ));

-- Insert default menu items
INSERT INTO public.menu_items (label, url, menu_type, sort_order) VALUES
('Ana Sayfa', '/', 'main', 1),
('Tedaviler', '/treatments', 'main', 2),
('Destinasyonlar', '/destinations', 'main', 3),
('Destek', '/support', 'main', 4),
('Hakkımızda', '/about', 'footer', 1),
('İletişim', '/contact', 'footer', 2),
('Gizlilik Politikası', '/privacy', 'footer', 3),
('Kullanım Şartları', '/terms', 'footer', 4);

-- Update existing cms_articles table to better support page management
-- Add page_type column to distinguish between articles and pages
ALTER TABLE public.cms_articles ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'article';

-- Add template column for different page layouts
ALTER TABLE public.cms_articles ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'default';

-- Insert static pages into cms_articles
INSERT INTO public.cms_articles (
  title, slug, content, status, language, author_id, page_type, template, published_at
) VALUES
('Ana Sayfa', 'home-page', '<h1>JAW BREAKER''e Hoş Geldiniz</h1><p>Medikal turizm için güvenilir çözümler sunuyoruz.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'home', now()),
('Hakkımızda', 'about-page', '<h1>Hakkımızda</h1><p>JAW BREAKER, medikal turizm alanında öncü bir platformdur.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'default', now()),
('İletişim', 'contact-page', '<h1>İletişim</h1><p>Bizimle iletişime geçin.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'contact', now()),
('Destek', 'support-page', '<h1>Destek</h1><p>Size yardımcı olmak için buradayız.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'support', now()),
('Gizlilik Politikası', 'privacy-page', '<h1>Gizlilik Politikası</h1><p>Gizliliğinizi korumak önceliğimizdir.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'legal', now()),
('Kullanım Şartları', 'terms-page', '<h1>Kullanım Şartları</h1><p>Hizmetlerimizi kullanarak bu şartları kabul etmiş olursunuz.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'legal', now()),
('Tıbbi Sorumluluk Reddi', 'medical-disclaimer-page', '<h1>Tıbbi Sorumluluk Reddi</h1><p>Bu platform tıbbi tavsiye vermez.</p>', 'published', 'tr', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'page', 'legal', now())
ON CONFLICT (slug) DO NOTHING;

-- Create SEO meta table for better SEO management
CREATE TABLE public.seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  robots_meta TEXT DEFAULT 'index,follow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on seo_pages
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing SEO data (anyone can view)
CREATE POLICY "Anyone can view SEO pages" 
  ON public.seo_pages 
  FOR SELECT 
  USING (true);

-- Create policy for admins to manage SEO data
CREATE POLICY "Admins can manage SEO pages" 
  ON public.seo_pages 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ));

-- Insert default SEO data for pages
INSERT INTO public.seo_pages (page_slug, meta_title, meta_description) VALUES
('home-page', 'JAW BREAKER - Medikal Turizm Platformu', 'Güvenilir medikal turizm hizmetleri. En iyi klinikler ve tedaviler.'),
('about-page', 'Hakkımızda - JAW BREAKER', 'JAW BREAKER hakkında bilgi edinin.'),
('contact-page', 'İletişim - JAW BREAKER', 'Bizimle iletişime geçin.'),
('support-page', 'Destek - JAW BREAKER', '7/24 destek hizmetlerimiz.'),
('privacy-page', 'Gizlilik Politikası - JAW BREAKER', 'Gizlilik politikamızı okuyun.'),
('terms-page', 'Kullanım Şartları - JAW BREAKER', 'Hizmet kullanım şartlarımız.'),
('medical-disclaimer-page', 'Tıbbi Sorumluluk Reddi - JAW BREAKER', 'Tıbbi sorumluluk reddi metni.');
