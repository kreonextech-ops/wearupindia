-- ════════════════════════════════════════════════════════════════
-- REDEFINE-GRAPHIC-KITS.SQL
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════

-- Ensure we have a clean Graphic Kits category
INSERT INTO public.categories (name, slug, description, tagline, is_active)
VALUES 
  ('Graphic Kits', 'graphic-kits', 'High-performance vinyl wraps and decal kits for motorcycles.', 'Dress Your Machine', true)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline;

-- Clean up any "messy" test data in this category to start fresh
DELETE FROM public.products 
WHERE category_id IN (SELECT id FROM public.categories WHERE slug = 'graphic-kits');

-- Verification
SELECT * FROM public.categories WHERE slug = 'graphic-kits';
