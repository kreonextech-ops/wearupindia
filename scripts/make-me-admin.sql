-- ════════════════════════════════════════════════════════════════
-- MAKE-ME-ADMIN.SQL
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- 
-- PURPOSE: Makes a specific user an admin so they can see all 
-- orders and customers in the Admin Panel without RLS blocking them.
-- ════════════════════════════════════════════════════════════════

-- CHANGE THE EMAIL BELOW TO YOUR ACTUAL ADMIN EMAIL:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'amitsz3675@gmail.com';

-- Verify it worked
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
