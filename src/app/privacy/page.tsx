export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly: name, email, phone, delivery address, and payment details during checkout. We also collect browsing data (device type, pages visited) to improve your experience.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'Your information is used to process orders, send updates via email/WhatsApp, improve our products and services, and send occasional promotional offers (opt-out available anytime).',
    },
    {
      title: '3. Data Sharing',
      content: 'We do not sell your personal data. We share necessary information with delivery partners (Delhivery, Blue Dart) and payment processors only as required to complete your order.',
    },
    {
      title: '4. Data Security',
      content: 'All transactions are secured with 256-bit SSL encryption. Payment information is never stored on our servers — processed directly via Razorpay/UPI gateways.',
    },
    {
      title: '5. Cookies',
      content: 'We use essential cookies to maintain your cart and session, and analytics cookies (Google Analytics) to understand site usage. You can disable non-essential cookies in your browser settings.',
    },
    {
      title: '6. Your Rights',
      content: 'You can request access, correction, or deletion of your personal data by contacting us at hello@wearup.in. We will respond within 30 days.',
    },
    {
      title: '7. Contact',
      content: 'For privacy concerns: hello@wearup.in | WearUp India, Medical More, Shibmandir, Siliguri 734011, West Bengal, India.',
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Legal</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">PRIVACY POLICY</h1>
        <p className="font-mono text-[11px] text-[#555] mb-12">Last updated: December 2024</p>

        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.title} className="pb-8 border-b border-[#1a1a1a]">
              <h2 className="font-display font-bold text-lg text-white mb-3">{section.title}</h2>
              <p className="font-body text-[#666] text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
