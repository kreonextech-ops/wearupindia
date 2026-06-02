require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: orderData, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        products ( name )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Order Data:', JSON.stringify(orderData, null, 2));

  const items = orderData.order_items?.map((item) => ({
    name: item.products?.name || 'Product',
    quantity: item.quantity,
    price: item.price_at_purchase
  })) || [];

  const body = {
    email: orderData.shipping_address?.email,
    customerName: orderData.shipping_address?.full_name,
    orderId: orderData.payment_intent_id,
    totalAmount: orderData.total_amount,
    items: items
  };

  console.log('Payload:', body);
  
  try {
    const res = await fetch(`http://localhost:3000/api/emails/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    console.log('API Status:', res.status);
    console.log('API Response:', await res.json());
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
