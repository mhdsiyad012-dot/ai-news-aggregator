-- Complete Schema Migration for Articles & AI Directory
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    source_name VARCHAR(100) DEFAULT 'Intelligence Wire',
    related_tools TEXT DEFAULT '',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published_at VARCHAR(100) DEFAULT 'Recent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS source_name VARCHAR(100) DEFAULT 'Intelligence Wire';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS related_tools TEXT DEFAULT '';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at VARCHAR(100) DEFAULT 'Recent';

CREATE INDEX IF NOT EXISTS ix_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS ix_articles_is_pinned ON public.articles (is_pinned);

CREATE TABLE IF NOT EXISTS public.ai_directory (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    creator VARCHAR(200) NOT NULL,
    short_purpose VARCHAR(500) NOT NULL,
    primary_category VARCHAR(100) NOT NULL,
    tags TEXT NOT NULL,
    detailed_overview TEXT NOT NULL,
    key_capabilities TEXT NOT NULL,
    best_use_cases TEXT NOT NULL,
    pricing_model VARCHAR(200) NOT NULL,
    official_url VARCHAR(2048) NOT NULL,
    release_status VARCHAR(100) NOT NULL DEFAULT 'Generally Available',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure is_featured exists if table was already created
ALTER TABLE public.ai_directory ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_ai_directory_primary_category ON public.ai_directory (primary_category);
CREATE INDEX IF NOT EXISTS ix_ai_directory_is_featured ON public.ai_directory (is_featured);

-- Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_directory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to articles" ON public.articles;
CREATE POLICY "Allow public read access to articles" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to ai_directory" ON public.ai_directory;
CREATE POLICY "Allow public read access to ai_directory" ON public.ai_directory FOR SELECT USING (true);
