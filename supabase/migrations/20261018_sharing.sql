-- ==============================================================================
-- TripAi - Public Shared Trip Lookup Migration
-- Matches Section 5 & 6 of backend-tech-stack.md
-- ==============================================================================

-- Drop any previous version of the function first to prevent
-- "cannot change return type of existing function" errors in Supabase.
DROP FUNCTION IF EXISTS public.get_shared_trip(TEXT);

-- 1. Create a SECURITY DEFINER function for public shared trip lookups.
-- This function runs with the privileges of its creator to bypass RLS, but strictly
-- exposes ONLY public trip data when is_shared is TRUE.
-- It NEVER exposes user_id, email, or any owner information.
-- search_path is set explicitly to prevent search_path hijacking vulnerabilities.
CREATE OR REPLACE FUNCTION public.get_shared_trip(p_share_id TEXT)
RETURNS TABLE (
    destination TEXT,
    country TEXT,
    cover_image_url TEXT,
    num_days INTEGER,
    plan JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT
        t.destination,
        t.country,
        t.cover_image_url,
        t.num_days,
        t.plan
    FROM public.trips t
    WHERE t.share_id = p_share_id
      AND t.is_shared = true
    LIMIT 1;
$$;

-- 2. Grant execute permission to anon and authenticated roles
-- This allows unauthenticated visitors (via Supabase anon key) to read shared trips.
GRANT EXECUTE ON FUNCTION public.get_shared_trip(TEXT) TO anon, authenticated;
