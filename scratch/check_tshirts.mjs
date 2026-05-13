
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkTShirtProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug)')
    .or(`slug.eq.t-shirts,slug.eq.tshirts`, { foreignTable: 'categories' });

  if (error) {
    console.error(error);
    return;
  }
  console.log('Products in T-Shirt categories:');
  data.forEach(p => console.log(`- Name: ${p.name}, Category Slug: ${p.categories.slug}`));
}

checkTShirtProducts();
