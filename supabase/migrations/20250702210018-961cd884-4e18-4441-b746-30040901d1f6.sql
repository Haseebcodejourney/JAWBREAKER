
-- CMS Blog/Article Management Tables
CREATE TABLE public.cms_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.cms_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.cms_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.cms_articles (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.cms_article_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.cms_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.cms_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, tag_id)
);

CREATE TABLE public.cms_media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  folder_path TEXT DEFAULT '/',
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SEO Management Table
CREATE TABLE public.seo_meta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL, -- 'article', 'clinic', 'treatment', 'page'
  page_id UUID, -- ID of the related content
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  canonical_url TEXT,
  robots_meta TEXT DEFAULT 'index,follow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page_type, page_id)
);

-- RLS Policies for CMS
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;

-- CMS Categories Policies
CREATE POLICY "Anyone can view active categories" ON public.cms_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.cms_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CMS Tags Policies
CREATE POLICY "Anyone can view tags" ON public.cms_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON public.cms_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CMS Articles Policies
CREATE POLICY "Anyone can view published articles" ON public.cms_articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their articles" ON public.cms_articles
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all articles" ON public.cms_articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CMS Article Tags Policies
CREATE POLICY "Anyone can view article tags" ON public.cms_article_tags
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage their article tags" ON public.cms_article_tags
  FOR ALL USING (
    article_id IN (SELECT id FROM public.cms_articles WHERE author_id = auth.uid())
  );

CREATE POLICY "Admins can manage all article tags" ON public.cms_article_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Media Library Policies
CREATE POLICY "Anyone can view media" ON public.cms_media_library
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON public.cms_media_library
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their media" ON public.cms_media_library
  FOR ALL USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can manage all media" ON public.cms_media_library
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SEO Meta Policies
CREATE POLICY "Anyone can view SEO meta" ON public.seo_meta
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage SEO meta" ON public.seo_meta
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes for better performance
CREATE INDEX idx_cms_articles_status ON public.cms_articles(status);
CREATE INDEX idx_cms_articles_published_at ON public.cms_articles(published_at);
CREATE INDEX idx_cms_articles_category_id ON public.cms_articles(category_id);
CREATE INDEX idx_cms_articles_author_id ON public.cms_articles(author_id);
CREATE INDEX idx_cms_articles_language ON public.cms_articles(language);
CREATE INDEX idx_cms_categories_parent_id ON public.cms_categories(parent_id);
CREATE INDEX idx_cms_media_library_file_type ON public.cms_media_library(file_type);
CREATE INDEX idx_seo_meta_page_type_id ON public.seo_meta(page_type, page_id);
