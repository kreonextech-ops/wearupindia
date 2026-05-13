
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWishlists() {
  const { data: wishlists, error } = await supabase.from('wishlists').select('*');
  if (error) {
    console.error('Error fetching wishlists:', error.message);
    return;
  }
  console.log('Wishlists found:', wishlists.length);
  wishlists.forEach(w => {
    console.log(`User: ${w.user_id}, Items: ${JSON.stringify(w.items)}`);
  });

  const { data: profiles } = await supabase.from('profiles').select('id, email, full_name');
  console.log('\nProfiles:');
  profiles?.forEach(p => {
    console.log(`ID: ${p.id}, Email: ${p.email}, Name: ${p.full_name}`);
  });
}

checkWishlists();
