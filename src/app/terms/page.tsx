export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using wearup.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
    },
    {
      title: '2. Products & Services',
      content: 'All product descriptions, prices, and availability are subject to change without notice. We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion.',
    },
    {
      title: '3. Pricing & Payment',
      content: 'All prices are in Indian Rupees (₹) and inclusive of applicable GST. Payment must be completed before order dispatch. We accept UPI and credit/debit cards.',
    },
    {
      title: '5. Intellectual Property',
      content: 'All content on wearup.in including logos, images, and designs are the property of WearUp India and may not be reproduced without written permission.',
    },
    {
      title: '6. Limitation of Liability',
      content: 'WearUp shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or services. Our maximum liability is limited to the order value.',
    },
    {
      title: '7. Governing Law',
      content: 'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Siliguri, West Bengal.',
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Legal</p>
        <h1 className="font-display font-black text-5xl text-white mb-3">TERMS OF SERVICE</h1>
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
