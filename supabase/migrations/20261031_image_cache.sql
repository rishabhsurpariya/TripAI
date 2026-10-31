-- ==============================================================================
-- TripAi - Image & Geocoding Cache Migration
-- Enables persistent caching of Unsplash photos and Nominatim coordinates
-- ==============================================================================

-- 1. Create image_cache table for Unsplash results
CREATE TABLE IF NOT EXISTS public.image_cache (
    query TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    photographer_name TEXT,
    photographer_url TEXT,
    unsplash_url TEXT,
    download_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance index on created_at for optional TTL maintenance
CREATE INDEX IF NOT EXISTS idx_image_cache_created_at ON public.image_cache(created_at);

-- 2. Create geocoding_cache table for Nominatim coordinates
CREATE TABLE IF NOT EXISTS public.geocoding_cache (
    query TEXT PRIMARY KEY,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geocoding_cache_created_at ON public.geocoding_cache(created_at);

-- 3. Row Level Security (RLS)
ALTER TABLE public.image_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geocoding_cache ENABLE ROW LEVEL SECURITY;

-- Allow reading cached images/coordinates
CREATE POLICY "Public read image cache"
    ON public.image_cache
    FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can insert image cache"
    ON public.image_cache
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Public read geocoding cache"
    ON public.geocoding_cache
    FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can insert geocoding cache"
    ON public.geocoding_cache
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
