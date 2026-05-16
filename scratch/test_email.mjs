import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testEmail() {
  console.log('Attempting to send test email...');
  try {
    const { data, error } = await resend.emails.send({
      from: 'WearUp <info@wearupindia.com>',
      to: 'test@example.com', // Using a dummy external address
      subject: 'Final Verification Test',
      html: '<h1>If this reached the API, verification is 100%!</h1>'
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log('Email sent successfully!', data);
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

testEmail();
