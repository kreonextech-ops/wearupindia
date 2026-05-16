import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { email, customerName, orderId, totalAmount, items } = body;

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send the email using Resend
    console.log(`Attempting to send email to ${email} for order ${orderId}`);
    
    let emailResult;
    try {
      emailResult = await resend.emails.send({
        from: 'WearUp <info@wearupindia.com>',
        to: email,
        bcc: 'info@wearupindia.com',
        subject: `Order Confirmed: ${orderId}`,
        react: OrderConfirmationEmail({
          customerName,
          orderId,
          totalAmount,
          items,
        }),
      });
    } catch (renderError: any) {
      console.error('React Email Render Error:', renderError);
      return NextResponse.json({ error: `Render Error: ${renderError.message}` }, { status: 500 });
    }

    const { data, error } = emailResult;

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}
