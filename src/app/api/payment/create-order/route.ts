import { NextResponse } from 'next/server';

const CASHFREE_APP_ID = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox';
const CASHFREE_BASE_URL = CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, orderAmount, customerDetails } = body;

    const payload = {
      order_amount: orderAmount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.id || 'guest',
        customer_phone: customerDetails.phone || '9999999999',
        customer_email: customerDetails.email || 'guest@example.com',
        customer_name: customerDetails.name || 'Guest',
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?order_id={order_id}`,
      },
    };

    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to create order' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Cashfree Create Order Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
