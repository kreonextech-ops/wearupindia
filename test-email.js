require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function test() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log("Testing Resend API with from: info@wearupindia.com to: amitsz3675@gmail.com");
  const { data, error } = await resend.emails.send({
    from: 'WearUp <info@wearupindia.com>',
    to: 'amitsz3675@gmail.com', // from the screenshots
    subject: `Test Order`,
    html: '<p>Test</p>',
  });
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
