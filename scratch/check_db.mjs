
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('Total products:', products.length);
  products.forEach(p => {
    console.log(`- ID: ${p.id}, Name: ${p.name}, Featured: ${p.is_featured}, New: ${p.is_new}, Price: ${p.price}`);
  });
}

checkProducts();
