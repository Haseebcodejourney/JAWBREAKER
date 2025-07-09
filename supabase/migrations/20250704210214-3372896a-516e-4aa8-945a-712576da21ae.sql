
-- Add translation_key column to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN translation_key TEXT;

-- Update existing menu items with translation keys
UPDATE public.menu_items 
SET translation_key = CASE 
  WHEN label = 'Home' THEN 'nav.home'
  WHEN label = 'About' THEN 'nav.about'
  WHEN label = 'Services' THEN 'nav.services'
  WHEN label = 'Tedaviler' THEN 'nav.treatments'
  WHEN label = 'Destinasyonlar' OR label = 'Destinations' THEN 'nav.destinations'
  WHEN label = 'İletişim' THEN 'nav.contact'
  WHEN label = 'Destek' THEN 'nav.support'
  WHEN label = 'Blog' THEN 'nav.blog'
  WHEN label = 'SSS' THEN 'nav.faq'
  ELSE NULL
END
WHERE label IN ('Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'Tedaviler', 'Destinasyonlar', 'Destinations', 'İletişim', 'Destek', 'Blog', 'SSS');
