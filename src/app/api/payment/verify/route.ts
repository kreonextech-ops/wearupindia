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

    const isPaid = Array.isArray(payments) && payments.some((p: any) => p.payment_status === 'SUCCESS');

    // Update Supabase if paid
    if (isPaid) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_intent_id', orderId)
        .maybeSingle();

      if (order) {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', order.id);
      }
    }

    return NextResponse.json({ isPaid, payments });
  } catch (error: any) {
    console.error('Cashfree Verify Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
