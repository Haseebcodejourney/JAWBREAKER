
-- Create separate blog_articles table for blog content
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  category_id UUID REFERENCES public.cms_categories(id),
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'tr',
  reading_time_minutes INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on blog_articles
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_articles
CREATE POLICY "Anyone can view published blog articles" ON public.blog_articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their blog articles" ON public.blog_articles
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all blog articles" ON public.blog_articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create separate static_pages table for static pages
CREATE TABLE public.static_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  template TEXT DEFAULT 'default',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  language TEXT DEFAULT 'tr',
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  is_system_page BOOLEAN DEFAULT false, -- For pages like privacy, terms etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on static_pages
ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for static_pages
CREATE POLICY "Anyone can view published static pages" ON public.static_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage static pages" ON public.static_pages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Migrate existing pages from cms_articles to static_pages
INSERT INTO public.static_pages (title, slug, content, template, status, language, author_id, is_system_page)
SELECT title, slug, content, template, status, language, author_id, true
FROM public.cms_articles 
WHERE page_type = 'page';

-- Remove pages from cms_articles (keep only blog articles)
DELETE FROM public.cms_articles WHERE page_type = 'page';

-- Remove page_type column from cms_articles as it's no longer needed
ALTER TABLE public.cms_articles DROP COLUMN IF EXISTS page_type;
ALTER TABLE public.cms_articles DROP COLUMN IF EXISTS template;

-- Add blog-specific columns to cms_articles
ALTER TABLE public.cms_articles ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER;
ALTER TABLE public.cms_articles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX idx_blog_articles_status ON public.blog_articles(status);
CREATE INDEX idx_blog_articles_published_at ON public.blog_articles(published_at);
CREATE INDEX idx_blog_articles_category_id ON public.blog_articles(category_id);
CREATE INDEX idx_blog_articles_author_id ON public.blog_articles(author_id);
CREATE INDEX idx_blog_articles_language ON public.blog_articles(language);
CREATE INDEX idx_blog_articles_tags ON public.blog_articles USING GIN(tags);

CREATE INDEX idx_static_pages_status ON public.static_pages(status);
CREATE INDEX idx_static_pages_slug ON public.static_pages(slug);
CREATE INDEX idx_static_pages_language ON public.static_pages(language);
