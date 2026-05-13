const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

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
