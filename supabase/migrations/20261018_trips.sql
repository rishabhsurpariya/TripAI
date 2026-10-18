-- ==============================================================================
-- TripAi - Trips Database Schema Migration
-- Matches Section 5 ("Database Schema") of backend-tech-stack.md
-- ==============================================================================

-- 1. Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    country TEXT,
    cover_image_url TEXT,
    start_date DATE,
    num_days INTEGER,
    travelers INTEGER DEFAULT 1,
    style TEXT,
    total_budget NUMERIC DEFAULT 0,
    plan JSONB NOT NULL DEFAULT '{}'::jsonb,
    share_id TEXT UNIQUE,
    is_shared BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Performance indexes for user lookups, start date sorting, and share lookups
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_share_id ON public.trips(share_id);

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_trips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_trips_updated_at ON public.trips;
CREATE TRIGGER trigger_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_trips_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Strictly owner-only access: users can only SELECT, INSERT, UPDATE, and DELETE their own rows.
-- NO public select policy is added (shared trips are accessed via secure server routes later).

DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips"
    ON public.trips
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trips" ON public.trips;
CREATE POLICY "Users can insert own trips"
    ON public.trips
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips"
    ON public.trips
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips"
    ON public.trips
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
