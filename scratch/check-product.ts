import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProduct() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug)')
    .eq('categories.slug', 'graphic-kits')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return;
  }

  console.log('--- PRODUCT DATA ---');
  console.log('Name:', data.name);
  console.log('Base Price:', data.price);
  console.log('Meta Data:', JSON.stringify(data.meta_data, null, 2));
}

checkProduct();
