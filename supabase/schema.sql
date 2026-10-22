-- =========================================================================
-- OPTIMUS PRIME DATABASE SCHEMA
-- Supabase PostgreSQL Migration for Platform Settings, Directory & Articles
-- =========================================================================

-- 1. App Platform Settings Table (Stores active dynamic Gemini API key, site config)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default settings if not exists
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('gemini_api_key', 'your_gemini_api_key_here', 'Active Google Gemini API Key for autonomous intelligence'),
    ('site_headline', 'Live AI Intelligence & Ecosystem Index', 'Hero headline display title'),
    ('site_tagline', 'The verified agency-grade intelligence wire. Ingesting breaking model breakthroughs, autonomous coding agents, and 45+ indexed AI platforms.', 'Hero sub-copy'),
    ('announcement_active', 'true', 'Whether announcement banner is displayed'),
    ('announcement_text', 'Optimus Prime 2.0 Live — Featuring Gemini 3.8 Flash Synthesis & Dual-Filter Directory', 'Announcement banner copy')
ON CONFLICT (key) DO NOTHING;

-- 2. AI Directory Systems Table
CREATE TABLE IF NOT EXISTS public.ai_directory (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    category TEXT NOT NULL,
    secondary_categories TEXT[] DEFAULT '{}',
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    key_features TEXT[] DEFAULT '{}',
    best_for TEXT NOT NULL,
    pricing TEXT NOT NULL,
    official_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    architecture_details TEXT,
    company_background TEXT,
    related_tool_slugs TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for high-speed filtering
CREATE INDEX IF NOT EXISTS idx_ai_dir_category ON public.ai_directory(category);
CREATE INDEX IF NOT EXISTS idx_ai_dir_company ON public.ai_directory(company);
CREATE INDEX IF NOT EXISTS idx_ai_dir_is_featured ON public.ai_directory(is_featured);
CREATE INDEX IF NOT EXISTS idx_ai_dir_slug ON public.ai_directory(slug);

-- 3. Live News Articles Wire Table
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'LLMs',
    source_name TEXT NOT NULL DEFAULT 'AI Wire',
    relative_time TEXT,
    utc_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ai_takeaway TEXT,
    is_pinned BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_pinned ON public.articles(is_pinned);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to directory and articles
CREATE POLICY "Public Read Access for AI Directory" ON public.ai_directory FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Articles" ON public.articles FOR SELECT USING (true);

-- Allow public read access only to public non-sensitive settings (exclude API key by query filter in service)
CREATE POLICY "Public Read Access for Settings" ON public.app_settings FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Full Access for Service Role Settings" ON public.app_settings USING (true) WITH CHECK (true);
CREATE POLICY "Full Access for Service Role Directory" ON public.ai_directory USING (true) WITH CHECK (true);
CREATE POLICY "Full Access for Service Role Articles" ON public.articles USING (true) WITH CHECK (true);
