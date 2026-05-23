import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || '';
Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, orderAmount, customerDetails } = body;
    
    const request = {
      order_amount: orderAmount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.id || 'guest',
        customer_phone: customerDetails.phone || '9999999999',
        customer_email: customerDetails.email || 'guest@example.com',
        customer_name: customerDetails.name || 'Guest'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?order_id={order_id}`
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Cashfree Create Order Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.response?.data?.message || error.message }, { status: 500 });
  }
}
