-- Migration for AI Models & Agents Directory table
CREATE TABLE IF NOT EXISTS public.ai_directory (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_ai_directory_slug ON public.ai_directory (slug);
CREATE INDEX IF NOT EXISTS ix_ai_directory_primary_category ON public.ai_directory (primary_category);

-- Ensure public read access if Supabase Client is queried directly
ALTER TABLE public.ai_directory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to ai_directory" ON public.ai_directory
    FOR SELECT USING (true);

-- Ensure public read access to articles for Supabase client
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to articles" ON public.articles
    FOR SELECT USING (true);
