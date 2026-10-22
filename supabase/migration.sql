-- =========================================================================
-- OPTIMUS PRIME & TOOLSAI MANAGER IDEMPOTENT SUPABASE MIGRATION
-- Project: https://gxqxogdbfmvlqfkbdtxr.supabase.co
-- Compatible with PostgreSQL 15+ / Supabase
-- Run this in the Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. APP PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT false,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure is_secret column exists if table was created previously without it
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS is_secret BOOLEAN DEFAULT false;
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Seed default application settings
INSERT INTO public.app_settings (key, value, is_secret, description)
VALUES 
    ('site_headline', 'Live AI Intelligence & Ecosystem Index', false, 'Hero headline display title'),
    ('site_tagline', 'Live AI Intelligence & Ecosystem Index', false, 'Hero subtitle displayed on the public homepage'),
    ('banner_message', 'Optimus Prime v2.0 Live — Powered by Gemini 2.5 Flash', false, 'Global announcement bar text'),
    ('banner_active', 'true', false, 'Toggle top announcement banner ("true" or "false")')
ON CONFLICT (key) DO NOTHING;

-- 2. AI DIRECTORY TABLE
-- In our schema, 'id' is the primary key text slug (e.g. "google-gemini", "cursor-editor")
CREATE TABLE IF NOT EXISTS public.ai_directory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT 'Independent',
    category TEXT NOT NULL DEFAULT 'Workflow & Automation',
    secondary_categories TEXT[] DEFAULT '{}',
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    key_features TEXT[] DEFAULT '{}',
    best_for TEXT NOT NULL DEFAULT '',
    pricing TEXT NOT NULL DEFAULT 'Freemium',
    official_url TEXT NOT NULL DEFAULT '',
    is_featured BOOLEAN DEFAULT false,
    architecture_details TEXT,
    company_background TEXT,
    related_tool_slugs TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all enhanced fields exist if table was partially created
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS secondary_categories TEXT[] DEFAULT '{}';
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS key_features TEXT[] DEFAULT '{}';
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS architecture_details TEXT;
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS company_background TEXT;
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS related_tool_slugs TEXT[] DEFAULT '{}';
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- High-speed indexes for the frontend directory
CREATE INDEX IF NOT EXISTS idx_ai_dir_category ON public.ai_directory(category);
CREATE INDEX IF NOT EXISTS idx_ai_dir_company ON public.ai_directory(company);
CREATE INDEX IF NOT EXISTS idx_ai_dir_is_featured ON public.ai_directory(is_featured);
CREATE INDEX IF NOT EXISTS idx_ai_dir_created_at ON public.ai_directory(created_at DESC);

-- 3. ARTICLES (NEWS WIRE) TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id TEXT UNIQUE,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    source_domain TEXT NOT NULL DEFAULT 'ai-wire.io',
    category TEXT NOT NULL DEFAULT 'LLMs',
    summary TEXT NOT NULL DEFAULT '',
    ai_takeaway TEXT,
    is_pinned BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all news fields exist
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS source_domain TEXT NOT NULL DEFAULT 'ai-wire.io';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ai_takeaway TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- High-speed news indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_pinned ON public.articles(is_pinned);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Helper to safely drop and recreate RLS policies idempotently
DO $$
BEGIN
    -- Drop existing policies if they exist to prevent duplicate errors
    DROP POLICY IF EXISTS "Public Read Settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Public Read Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
    DROP POLICY IF EXISTS "Autonomous Sync Upsert Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Autonomous Sync Upsert Articles" ON public.articles;
    DROP POLICY IF EXISTS "Service Role Settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Service Role Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Service Role Articles" ON public.articles;
END $$;

-- A. PUBLIC READ ACCESS: Everyone (including SSR & Next.js frontend) can query data
CREATE POLICY "Public Read Settings" ON public.app_settings 
    FOR SELECT TO public, anon, authenticated 
    USING (is_secret IS FALSE OR is_secret IS NULL);

CREATE POLICY "Public Read Directory" ON public.ai_directory 
    FOR SELECT TO public, anon, authenticated 
    USING (true);

CREATE POLICY "Public Read Articles" ON public.articles 
    FOR SELECT TO public, anon, authenticated 
    USING (true);

-- B. AUTONOMOUS INGESTION / WORKER ACCESS:
-- Allows ToolsAI Manager agent running 24/7 to insert and update tools & articles
CREATE POLICY "Autonomous Sync Upsert Directory" ON public.ai_directory 
    FOR ALL TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Autonomous Sync Upsert Articles" ON public.articles 
    FOR ALL TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- C. SERVICE ROLE: Unrestricted access for admin / internal operations
CREATE POLICY "Service Role Settings" ON public.app_settings 
    FOR ALL TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service Role Directory" ON public.ai_directory 
    FOR ALL TO service_role 
    USING (true) 
    WITH CHECK (true);

-- D. GRANT SCHEMA PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Verification query
SELECT 
    'ai_directory' AS table_name, count(*) AS total_rows FROM public.ai_directory
UNION ALL
SELECT 
    'articles' AS table_name, count(*) AS total_rows FROM public.articles
UNION ALL
SELECT 
    'app_settings' AS table_name, count(*) AS total_rows FROM public.app_settings;
