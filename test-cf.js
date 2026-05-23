require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const orderId = 'WU-EEAF754C'; // From the screenshot
  const CASHFREE_APP_ID = process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  console.log('App ID:', CASHFREE_APP_ID);
  
  const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}/payments`, {
    method: 'GET',
    headers: {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': '2023-08-01',
    },
  });
  const data = await response.json();
  console.log('Cashfree Response:', JSON.stringify(data, null, 2));

  if (Array.isArray(data) && data.some(p => p.payment_status === 'SUCCESS')) {
    console.log('Payment is SUCCESS. Trying Supabase update...');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: supaData, error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('payment_intent_id', orderId)
        .select();
    console.log('Supabase update result:', supaData);
    console.log('Supabase update error:', error);
  }
}
test();
