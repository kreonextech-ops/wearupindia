-- ════════════════════════════════════════════════════════════════
-- ADD-MISSING-PROFILE-COLUMNS.SQL
-- Run this ONCE in: Supabase Dashboard → SQL Editor → Run
-- Fixes: Profile address and phone number not saving
-- ════════════════════════════════════════════════════════════════

-- 1. Add phone_number column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. Add shipping_address column as JSONB
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shipping_address jsonb;

-- 3. (Optional validation) Ensure updated_at exists in case 
-- it was also missing on some environments
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- That's it! Now the profile updates from Checkout and Profile page will work perfectly.
