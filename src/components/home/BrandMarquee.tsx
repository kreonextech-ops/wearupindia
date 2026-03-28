'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { brands } from '@/data';

export default function BrandMarquee() {
  // Triplicate for seamless infinite loop
  const tripled = [...brands, ...brands, ...brands];

  return (
    <section className="py-20 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
        <ScrollReveal direction="down">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-[#E8161B]" /> Compatibility
          </p>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase">
            Choose Your Machine
          </h2>
          <p className="font-body text-white/30 text-sm mt-4 max-w-md mx-auto">
            Every product engineered for your specific machine. Tap your brand to see what fits.
          </p>
        </ScrollReveal>
      </div>

      {/* Marquee Row 1 — left to right */}
      <div className="relative group marquee-wrapper">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {tripled.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/shop/brand/${brand.slug}`}
              className="group/item flex items-center gap-5 px-8 shrink-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8161B]/30 group-hover/item:bg-[#E8161B] group-hover/item:scale-150 transition-all duration-300 shrink-0" />
              <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.12em] text-white/10 group-hover/item:text-white transition-colors duration-400 uppercase whitespace-nowrap">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
