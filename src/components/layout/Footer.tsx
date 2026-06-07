import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone } from 'lucide-react';

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
    { label: 'Return Policy', href: '/return-policy' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Become a Reseller', href: '/become-a-reseller' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12 border-b border-border">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image src="/logo.png" alt="WearUp" fill className="object-contain" />
              </div>
              <span className="font-display font-black text-xl tracking-wider text-foreground">WEARUP</span>
            </div>
            <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-xs mb-6">
              Premium motorcycle wraps, accessories, and professional services across India.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/wearup_ind" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-wu-red transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com/wearupstore/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-wu-red transition-all">
                <Facebook size={16} />
              </a>
              <a href="https://wa.me/916296396462" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-wu-red transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-xs tracking-widest text-[#555] dark:text-[#888] uppercase mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground text-sm hover:text-foreground transition-colors font-body">
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
          <p className="text-muted-foreground/50 text-xs font-mono">
            © 2026 WEARUP. ALL RIGHTS RESERVED.
          </p>
          <p className="text-muted-foreground/30 text-xs font-mono">
            RIDE BOLD. STAY TRUE.
          </p>
        </div>
      </div>
    </footer>
  );
}
