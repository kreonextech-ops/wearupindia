import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CASHFREE_APP_ID = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox';
const CASHFREE_BASE_URL = CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    console.log('[Cashfree Verify] Checking order:', orderId);

    // Fetch order payments from Cashfree REST API
    const response = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    });

    const payments = await response.json();
    console.log('[Cashfree Verify] Payments:', JSON.stringify(payments));

    const isPaid = Array.isArray(payments) && payments.some((p: any) => p.payment_status === 'SUCCESS');
    console.log('[Cashfree Verify] isPaid:', isPaid);

    // Update Supabase using service role key (bypasses RLS, works for guest orders too)
    if (isPaid && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('payment_intent_id', orderId);
      if (error) console.error('[Cashfree Verify] Supabase update error:', error);
      else console.log('[Cashfree Verify] Supabase updated successfully');
    }

    return NextResponse.json({ isPaid, payments, orderId });
  } catch (error: any) {
    console.error('Cashfree Verify Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
