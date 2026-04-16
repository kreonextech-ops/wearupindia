-- ════════════════════════════════════════════════════════════════
-- WIPE-TEST-DATA.SQL
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- 
-- ⚠️ WARNING: THIS WILL DELETE ALL USERS AND ORDERS!
-- It will NOT delete products or categories.
-- ════════════════════════════════════════════════════════════════

-- 1. Delete all order items and orders
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;

-- 2. Delete all profiles (public user data)
TRUNCATE TABLE public.profiles CASCADE;

-- 3. Delete all authentication users (logs everyone out, requires signing up again)
DELETE FROM auth.users;

-- After running this, your store is completely wiped of test data.
-- You will need to sign up again to create a new admin account.
