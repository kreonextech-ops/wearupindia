import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, customerName, orderId, totalAmount, items } = body;

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'WearUp <info@wearupindia.com>',
      to: email,
      bcc: 'info@wearupindia.com', // Sends a copy to the admin so you know an order came in
      subject: `Order Confirmed: ${orderId}`,
      react: OrderConfirmationEmail({
        customerName,
        orderId,
        totalAmount,
        items,
      }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}
