import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vuzltfyorxjufdkookxb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1emx0ZnlvcnhqdWZka29va3hiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcwMTExNCwiZXhwIjoyMDkwMjc3MTE0fQ.sm-i3EWf4cqkmLJHo2Oq42N3cGnfSCg05ttV7AZHpKQ'
);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  console.log(JSON.stringify(data.filter(p => p.name.toLowerCase().includes('himalayan') || JSON.stringify(p.meta_data).toLowerCase().includes('himalayan')), null, 2));
}

run();
