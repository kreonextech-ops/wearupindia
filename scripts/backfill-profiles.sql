-- ════════════════════════════════════════════════════════════════
-- BACKFILL-PROFILES.SQL
-- Run this ONCE in: Supabase Dashboard → SQL Editor → Run
--
-- PURPOSE: Creates a profile row for every auth user who signed up
-- BEFORE the handle_new_user trigger existed. This ensures each
-- email account gets its own isolated profile row.
-- ════════════════════════════════════════════════════════════════

-- Insert a profile for every auth.user who doesn't have one yet.
-- ON CONFLICT (id) DO NOTHING = safe to run multiple times.
INSERT INTO public.profiles (id, email, role, created_at, updated_at)
SELECT
  au.id,
  au.email,
  'customer',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Show a summary of what was created
SELECT
  COUNT(*) AS total_profiles,
  COUNT(*) FILTER (WHERE role = 'admin') AS admin_count,
  COUNT(*) FILTER (WHERE role = 'customer') AS customer_count
FROM public.profiles;

-- ════════════════════════════════════════════════════════════════
-- DONE
-- ════════════════════════════════════════════════════════════════
