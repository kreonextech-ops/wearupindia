import Link from 'next/link';
import { Instagram, Youtube, Twitter } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'Stickers & Wraps', href: '/shop/stickers-wraps' },
    { label: 'Accessories', href: '/shop/accessories' },
    { label: 'Merchandise', href: '/shop/merchandise' },
    { label: 'All Products', href: '/shop' },
  ],
  Services: [
    { label: 'Bike Wrapping', href: '/services/bike-wrapping' },
    { label: 'Detail Wash', href: '/services/detail-wash' },
    { label: 'Custom Decals', href: '/services/custom-decals' },
    { label: 'Book a Service', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2a2a2a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-[#1a1a1a]">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E8161B] flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">W</span>
              </div>
              <span className="font-display font-black text-xl tracking-wider">WEARUP</span>
            </div>
            <p className="text-[#666] text-sm font-body leading-relaxed max-w-xs mb-6">
              Leading the revolution in motorcycle aesthetics and performance precision across the Indian subcontinent.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} className="w-9 h-9 border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-[#E8161B] transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-xs tracking-widest text-[#555] uppercase mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#888] text-sm hover:text-white transition-colors font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-xs font-mono">
            © 2024 WEARUP KINETIC PRECISION. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[#333] text-xs font-mono">
            BUILT FOR THE BOLD. ENGINEERED IN INDIA.
          </p>
        </div>
      </div>
    </footer>
  );
}
