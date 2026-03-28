'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BrandGrid({ brands }: { brands: Brand[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {brands.map((brand, i) => (
        <ScrollReveal key={brand.slug} direction="up" delay={i * 0.05}>
          <Link 
            href={`/shop/brand/${brand.slug}`}
            className="group relative flex flex-col items-center gap-3 p-2 transition-all duration-300"
          >
            {/* Brand Image/Logo - SMALLER CIRCLE */}
            <div className="relative w-12 h-12 rounded-full border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center group-hover:border-[#E8161B]/50 transition-all duration-500 shadow-xl group-hover:shadow-[#E8161B]/10">
              <Image 
                src={brand.image} 
                alt={brand.name} 
                fill 
                className="object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as any).style.display = 'none';
                }}
              />
              <span className="font-display font-black text-[10px] text-white/20 group-hover:text-white transition-colors">
                {brand.name.charAt(0)}
              </span>
            </div>
            <span className="font-mono text-[8px] tracking-[0.3em] font-bold text-white/20 group-hover:text-white/60 uppercase transition-colors">
              {brand.name}
            </span>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
