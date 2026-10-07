-- Applied to the ai-news-aggregator Supabase project during setup.
-- The application connects with a server-side Postgres URI, so these rows do
-- not need to be exposed through Supabase's public Data API.
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_articles_url ON public.articles (url);
CREATE INDEX IF NOT EXISTS ix_articles_category ON public.articles (category);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.articles FROM anon, authenticated, service_role;
REVOKE ALL ON SEQUENCE public.articles_id_seq FROM anon, authenticated, service_role;
