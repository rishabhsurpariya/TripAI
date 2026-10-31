-- Migration: add currency column to trips table
-- Paste the entire contents of this file into the Supabase SQL Editor and run it.

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR';

-- Back-fill existing trips that have no currency stored yet (treat as INR)
UPDATE trips
SET currency = 'INR'
WHERE currency IS NULL OR currency = '';
