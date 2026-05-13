import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkKUI() {
  const { data: variants, error } = await supabase
    .from('variants')
    .select('*')
    .eq('product_id', 'a688863b-6d33-4f9e-a89e-2d9d9d9d9d9d'); // I need the real ID

  // Get ID first
  const { data: product } = await supabase.from('products').select('id').eq('slug', 'kui-bb20').single();
  if (!product) return console.log('Product not found');

  const { data: v } = await supabase.from('variants').select('*').eq('product_id', product.id);
  console.log('Variants for KUI:', v);
}

checkKUI();
