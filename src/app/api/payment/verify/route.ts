import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { createClient } from '@supabase/supabase-js';

// @ts-ignore
Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
// @ts-ignore
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || '';
// @ts-ignore
Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' 
// @ts-ignore
  ? Cashfree.Environment.PRODUCTION 
// @ts-ignore
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    
    // Fetch order payments from Cashfree
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    
    const payments = response.data;
    const isPaid = payments?.some((p: any) => p.payment_status === 'SUCCESS');

    // Update Supabase
    if (isPaid) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // Assuming orderId matches Supabase order.id or payment_intent_id
      // Since order_id sent to Cashfree might be the WU-XXX format
      // First, get the actual order
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
    console.error("Cashfree Verify Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.response?.data?.message || error.message }, { status: 500 });
  }
}
