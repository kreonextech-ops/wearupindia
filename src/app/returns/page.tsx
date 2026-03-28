import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Returns & Refunds</p>
        <h1 className="font-display font-black text-5xl text-white mb-12">RETURN POLICY</h1>

        <div className="space-y-8 font-body text-[#777] text-sm leading-relaxed">
          <div className="p-6 bg-[#111] border border-[#1a1a1a]">
            <h2 className="font-display font-black text-xl text-white mb-3">7-Day Return Window</h2>
            <p>If you receive a damaged, defective, or incorrect product, contact us within 7 days of delivery with photos. We will arrange a reverse pickup at no cost and issue a full refund or replacement.</p>
          </div>

          <div className="p-6 bg-[#111] border border-[#1a1a1a]">
            <h2 className="font-display font-black text-xl text-white mb-3">Non-Returnable Items</h2>
            <ul className="space-y-2 list-none">
              {[
                'Custom-cut or personalized stickers and decals',
                'Opened adhesive/vinyl rolls',
                'Products damaged due to improper installation',
                'Services (wrapping, detailing, decal design)',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#E8161B] mt-0.5">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-[#111] border border-[#1a1a1a]">
            <h2 className="font-display font-black text-xl text-white mb-3">Refund Timeline</h2>
            <p>Approved refunds are processed within 5–7 business days back to your original payment method. UPI/wallet refunds are typically instant once approved.</p>
          </div>

          <div className="p-6 bg-[#E8161B]/5 border border-[#E8161B]/20">
            <h2 className="font-display font-black text-xl text-white mb-3">How to Initiate a Return</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>WhatsApp us at <strong className="text-white">+91 98765 43210</strong> with your order ID and photos</li>
              <li>Our team reviews within 4 hours and approves eligible returns</li>
              <li>We arrange free reverse pickup</li>
              <li>Refund issued once item received and inspected</li>
            </ol>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/contact" className="inline-flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors">
            Contact Support <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
