export default function ShippingPage() {
  const sections = [
    {
      title: 'Delivery Timelines',
      items: [
        { q: 'Metro Cities (Delhi, Mumbai, Bengaluru, etc.)', a: '2–4 business days' },
        { q: 'Tier-2 Cities', a: '4–6 business days' },
        { q: 'Tier-3 & Remote Areas', a: '6–10 business days' },
        { q: 'Physical Services (Wrapping, Wash, Detailing)', a: 'Workshop only — Bengaluru pickup/drop' },
      ],
    },
    {
      title: 'Shipping Charges',
      items: [
        { q: 'Orders above ₹499', a: 'FREE' },
        { q: 'Orders below ₹499', a: '₹99 flat' },
        { q: 'Cash on Delivery', a: 'Additional ₹50 COD charge' },
        { q: 'Express Delivery', a: 'Available for ₹199 extra (metro only)' },
      ],
    },
    {
      title: 'Tracking & Support',
      items: [
        { q: 'Order Tracking', a: 'Tracking link sent via email and WhatsApp' },
        { q: 'Courier Partners', a: 'Delhivery, Blue Dart, Shiprocket' },
        { q: 'Damaged in Transit', a: 'Contact us within 24 hours with photos' },
        { q: 'Support', a: 'WhatsApp: +91 98765 43210 | hello@wearup.in' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Delivery Info</p>
        <h1 className="font-display font-black text-5xl text-white mb-12">SHIPPING POLICY</h1>

        <div className="space-y-10">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="font-display font-black text-2xl text-white mb-5 pb-3 border-b border-[#1a1a1a]">
                {section.title}
              </h2>
              <div className="space-y-0">
                {section.items.map(item => (
                  <div key={item.q} className="grid grid-cols-2 gap-4 py-4 border-b border-[#0f0f0f]">
                    <span className="font-body text-[#666] text-sm">{item.q}</span>
                    <span className="font-display font-bold text-sm text-white">{item.a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
