-- =========================================================================
-- OPTIMUS PRIME PRODUCTION ROW-LEVEL SECURITY (RLS) LOCKDOWN
-- Project: https://gxqxogdbfmvlqfkbdtxr.supabase.co
-- Zero-Leakage Policy: Strict Read-Only Anon + Isolated Service Role Mutations
-- =========================================================================

-- 1. ENABLE ROW LEVEL SECURITY ACROSS ALL TABLES
ALTER TABLE IF EXISTS public.ai_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.app_settings ENABLE ROW LEVEL SECURITY;

-- 2. CLEAN UP ALL LEGACY POLICIES
DO $$
BEGIN
    -- Drop legacy directory policies
    DROP POLICY IF EXISTS "Public Read Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Public Read Access for AI Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Service Role Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Full Access for Service Role Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Allow Anon Upsert to AI Directory" ON public.ai_directory;
    DROP POLICY IF EXISTS "Autonomous Sync Upsert Directory" ON public.ai_directory;

    -- Drop legacy articles policies
    DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
    DROP POLICY IF EXISTS "Public Read Access for Articles" ON public.articles;
    DROP POLICY IF EXISTS "Service Role Articles" ON public.articles;
    DROP POLICY IF EXISTS "Full Access for Service Role Articles" ON public.articles;
    DROP POLICY IF EXISTS "Allow Anon Upsert to Articles" ON public.articles;
    DROP POLICY IF EXISTS "Autonomous Sync Upsert Articles" ON public.articles;

    -- Drop legacy app_settings policies
    DROP POLICY IF EXISTS "Public Read Settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Public Read Access for Settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Service Role Settings" ON public.app_settings;
    DROP POLICY IF EXISTS "Full Access for Service Role Settings" ON public.app_settings;
END $$;

-- 3. AI DIRECTORY POLICIES
-- Public & Anon: Read-only access to all catalog tools
CREATE POLICY "Public Read Directory" ON public.ai_directory
    FOR SELECT TO public, anon, authenticated
    USING (true);

-- Service Role Only: Full CRUD mutations (upsert, insert, update, delete)
CREATE POLICY "Service Role Directory Full CRUD" ON public.ai_directory
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. ARTICLES (NEWS WIRE) POLICIES
-- Public & Anon: Read-only access to all news dispatches
CREATE POLICY "Public Read Articles" ON public.articles
    FOR SELECT TO public, anon, authenticated
    USING (true);

-- Service Role Only: Full CRUD mutations
CREATE POLICY "Service Role Articles Full CRUD" ON public.articles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. APP SETTINGS POLICIES (HARDENED AGAINST SECRET LEAKAGE)
-- Public & Anon: Only non-secret and non-sensitive key settings (NEVER return API keys)
CREATE POLICY "Public Read Settings Non-Secret" ON public.app_settings
    FOR SELECT TO public, anon, authenticated
    USING (
        (is_secret IS FALSE OR is_secret IS NULL)
        AND key NOT IN ('gemini_api_key', 'groq_api_key', 'openrouter_api_key', 'admin_secret', 'admin_password')
    );

-- Service Role Only: Full access to read and update all settings including API keys
CREATE POLICY "Service Role Settings Full Access" ON public.app_settings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
