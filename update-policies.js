const fs = require('fs');
const path = require('path');

const cwd = path.join(__dirname, 'src');

// 1. Footer.tsx
const footerPath = path.join(cwd, 'components/layout/Footer.tsx');
let footer = fs.readFileSync(footerPath, 'utf8');
footer = footer.replace("import { Instagram, Youtube, Twitter } from 'lucide-react';", "import { Instagram, Facebook, Phone } from 'lucide-react';");
footer = footer.replace("© 2024", "© 2026");
footer = footer.replace(`              {[
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-wu-red transition-all">
                  <Icon size={16} />
                </a>
              ))}`, `              {[
                { icon: Instagram, href: 'https://instagram.com/wearup_ind' },
                { icon: Facebook, href: 'https://facebook.com/wearupstore/' },
                { icon: Phone, href: 'https://wa.me/916296396462' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-wu-red transition-all">
                  <Icon size={16} />
                </a>
              ))}`);
fs.writeFileSync(footerPath, footer);

// 2. privacy/page.tsx
const privacyPath = path.join(cwd, 'app/privacy/page.tsx');
let privacy = fs.readFileSync(privacyPath, 'utf8');
privacy = privacy.replace(/hello@wearup\.in/g, 'info@wearupindia.com');
privacy = privacy.replace(/Razorpay\/UPI/gi, 'Cashfree/UPI');
privacy = privacy.replace(/WearUp India, Medical More, Shibmandir, Siliguri 734011, West Bengal, India/gi, 'WearUp India, Medical More, Shibmandir, Opp. Mukta Nursing Home, Siliguri, WB 734011');
fs.writeFileSync(privacyPath, privacy);

// 3. terms/page.tsx
const termsPath = path.join(cwd, 'app/terms/page.tsx');
let terms = fs.readFileSync(termsPath, 'utf8');
terms = terms.replace(/hello@wearup\.in/g, 'info@wearupindia.com');
terms = terms.replace(/WearUp Kinetic Precision/gi, 'WearUp India');
terms = terms.replace(/Bengaluru, Karnataka/gi, 'Siliguri, West Bengal');
terms = terms.replace(/We accept UPI, credit\/debit cards, and cash on delivery\./gi, 'We accept UPI and credit/debit cards.');

const warrantySection = `    {
      title: '4. Warranty',
      content: 'Wrapping services carry a 2-year workmanship warranty. Product warranties vary by item and are specified on individual product pages. Warranty is void for damage caused by improper use.',
    },
`;
terms = terms.replace(warrantySection, '');
fs.writeFileSync(termsPath, terms);

// 4. shipping/page.tsx
const shippingPath = path.join(cwd, 'app/shipping/page.tsx');
let shipping = fs.readFileSync(shippingPath, 'utf8');
shipping = shipping.replace(/hello@wearup\.in/g, 'info@wearupindia.com');
shipping = shipping.replace(/Bengaluru pickup\/drop/gi, 'Siliguri pickup/drop');
shipping = shipping.replace(/\+91 98765 43210/g, '+91 62963 96462');
shipping = shipping.replace(/Delhivery, Blue Dart, Shiprocket/g, 'Delhivery, Blue Dart, India Post');
shipping = shipping.replace(/Tracking link sent via email and WhatsApp/g, 'Tracking ID and shipping company will be provided to track orders');

const oldShippingCharges = `        { q: 'Orders above ₹499', a: 'FREE' },
        { q: 'Orders below ₹499', a: '₹99 flat' },
        { q: 'Cash on Delivery', a: 'Additional ₹50 COD charge' },
        { q: 'Express Delivery', a: 'Available for ₹199 extra (metro only)' },`;
const newShippingCharges = `        { q: 'Graphic Kits', a: 'FREE' },
        { q: 'Other Products', a: 'Depends on the product' },`;
shipping = shipping.replace(oldShippingCharges, newShippingCharges);

fs.writeFileSync(shippingPath, shipping);
console.log('Update complete!');
