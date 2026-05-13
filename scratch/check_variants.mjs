import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkVariants() {
  const { data: product, error: pError } = await supabase
    .from('products')
    .select('id, name')
    .eq('name', 'YFGUJH')
    .single();

  if (pError) {
    console.error('Product error:', pError);
    return;
  }

  console.log('Product Found:', product);

  const { data: variants, error: vError } = await supabase
    .from('variants')
    .select('*')
    .eq('product_id', product.id);

  if (vError) {
    console.error('Variants error:', vError);
    return;
  }

  console.log('Variants:', variants);
}

checkVariants();
