import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`id, name, slug, stock, categories(slug)`);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.table(data.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    stock: p.stock,
    category: p.categories?.slug
  })));
}

listProducts();
