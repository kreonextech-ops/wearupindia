-- ════════════════════════════════════════════════════════════════
-- REDEFINE-TSHIRTS.SQL
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════

-- Ensure we have a clean T-Shirts category
INSERT INTO public.categories (name, slug, description, tagline, is_active)
VALUES 
  ('T-Shirts', 'tshirts', 'Premium minimalist apparel designed for riders.', 'Wear The Brand', true)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline;

-- Ensure the products table has the necessary columns (already exists from schema.sql)
-- But we will enforce that T-shirts use the 'variants' table for sizes.

-- Clean up any "messy" test data in the tshirts category to start fresh
DELETE FROM public.products 
WHERE category_id IN (SELECT id FROM public.categories WHERE slug = 'tshirts');

-- Verification
SELECT * FROM public.categories WHERE slug = 'tshirts';
