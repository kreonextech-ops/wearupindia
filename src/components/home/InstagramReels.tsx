'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import { Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Reel IDs extracted from the Instagram URLs
const reels = [
  { id: 'DN0VVGFUpuq', href: 'https://www.instagram.com/reel/DN0VVGFUpuq/' },
  { id: 'DF0Jky2ywRg', href: 'https://www.instagram.com/reel/DF0Jky2ywRg/' },
  { id: 'DIk1MSAxUSQ', href: 'https://www.instagram.com/reel/DIk1MSAxUSQ/' },
  { id: 'DW6Z7piDjFi', href: 'https://www.instagram.com/reel/DW6Z7piDjFi/' },
];

export default function InstagramReels() {
  return (
    <section className="py-24 border-t border-border bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-wu-red" /> @wearup_ind
            </p>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic leading-none">
              Watch Us<br />Work
            </h2>
          </div>
          <Link
            href="https://www.instagram.com/wearup_ind"
            target="_blank"
            className="hidden md:flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors"
          >
            <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] tracking-widest uppercase">Follow on Instagram</span>
          </Link>
        </ScrollReveal>

        {/* Reel Embeds via direct iframe — full fit, clipped cleanly */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reels.map((reel, i) => (
            <ScrollReveal key={reel.id} direction="up" delay={i * 0.1} className="w-full">
              <Link href={reel.href} target="_blank" rel="noopener noreferrer" className="block group relative">
                {/* Outer clipping container — 9:16 fills the portrait video width */}
                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-border/50 hover:border-wu-red/30 transition-colors duration-500"
                  style={{ aspectRatio: '9 / 16' }}
                >
                  <iframe
                    src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                    style={{
                      position: 'absolute',
                      top: '-140px',               // aggressively hide header + profile row
                      left: 0,
                      width: '100%',
                      height: 'calc(100% + 140px + 300px)', // aggressively push chrome deep below clip
                      border: 'none',
                      display: 'block',
                    }}
                    scrolling="no"
                    allowFullScreen
                    loading="lazy"
                  />

                  {/* Transparent overlay to capture link clicks */}
                  <div className="absolute inset-0 z-10" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={0.4} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="https://www.instagram.com/wearup_ind"
            target="_blank"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(232,22,27,0.25)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
          >
            <Instagram size={14} />
            Follow Our Work <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
            New content every week
          </span>
        </ScrollReveal>

      </div>
    </section>
  );
}
