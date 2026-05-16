import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { email, customerName, orderId, totalAmount, items } = body;

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build item rows as plain HTML
    const itemRows = (items || [])
      .map((item: { name: string; quantity: number; price: number }) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;font-size:14px;">${item.name} x${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;font-weight:bold;text-align:right;">₹${item.price}</td>
        </tr>`
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#050505;padding:32px;text-align:center;">
              <span style="color:#ffffff;font-size:28px;font-weight:bold;letter-spacing:4px;">WEARUP</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="color:#333;font-size:24px;font-weight:bold;margin:0 0 20px;">Order Confirmed ✅</h1>
              <p style="color:#555;font-size:16px;line-height:26px;margin:0 0 16px;">Hey ${customerName || 'there'},</p>
              <p style="color:#555;font-size:16px;line-height:26px;margin:0 0 24px;">
                Thanks for gearing up with WearUp! We've received your order and will be in touch via WhatsApp to confirm delivery details.
              </p>

              <!-- Order ID Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="color:#333;font-size:16px;margin:0;">Order ID: <strong>${orderId}</strong></p>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e6ebf1;margin:24px 0;">

              <!-- Items -->
              <h3 style="color:#555;font-size:18px;font-weight:bold;margin:0 0 16px;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>

              <hr style="border:none;border-top:1px solid #e6ebf1;margin:24px 0;">

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:4px;padding:16px;">
                <tr>
                  <td style="padding:16px;">
                    <span style="color:#333;font-size:18px;font-weight:bold;">Total</span>
                  </td>
                  <td style="padding:16px;text-align:right;">
                    <span style="color:#e8161b;font-size:18px;font-weight:bold;">₹${totalAmount}</span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;text-align:center;">
                <tr>
                  <td align="center">
                    <a href="https://wearupindia.com/shop"
                       style="background:#e8161b;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;
                              display:inline-block;padding:14px 28px;border-radius:4px;letter-spacing:2px;">
                      CONTINUE SHOPPING
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <p style="color:#8898aa;font-size:12px;line-height:16px;margin:4px 0;">
                Need help? Contact us at info@wearupindia.com
              </p>
              <p style="color:#8898aa;font-size:12px;line-height:16px;margin:4px 0;">
                © ${new Date().getFullYear()} WearUp India. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    console.log(`Sending order confirmation email to ${email} for order ${orderId}`);

    const { data, error } = await resend.emails.send({
      from: 'WearUp <info@wearupindia.com>',
      to: email,
      bcc: 'info@wearupindia.com',
      subject: `Order Confirmed: ${orderId} 🎉`,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error('Unexpected error in email route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
