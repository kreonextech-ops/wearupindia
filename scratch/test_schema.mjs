
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data: firstProduct } = await supabase.from('products').select('id').limit(1).single();
  if (!firstProduct) {
    console.log('No products found to test.');
    return;
  }

  console.log('Testing update on product:', firstProduct.id);
  const { error } = await supabase
    .from('products')
    .update({ is_featured: false })
    .eq('id', firstProduct.id);

  if (error) {
    console.error('Update failed:', error.message);
  } else {
    console.log('Update successful! Column exists.');
  }
}

testUpdate();
