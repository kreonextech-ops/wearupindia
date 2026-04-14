'use client';

import { useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Your Instagram Reel links
const reels = [
  { href: 'https://www.instagram.com/reel/DN0VVGFUpuq/' },
  { href: 'https://www.instagram.com/reel/DF0Jky2ywRg/' },
  { href: 'https://www.instagram.com/reel/DIk1MSAxUSQ/' },
  { href: 'https://www.instagram.com/reel/DW6Z7piDjFi/' },
];

export default function InstagramReels() {
  useEffect(() => {
    const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

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

        {/* Reels — clipped to just the video area, hides header/comments/likes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reels.map((reel, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1} className="w-full">
              {/* 
                Outer container clips to show only the video portion of the embed.
                The Instagram iframe is ~503px tall total. 
                The video occupies the top portion (approx first 550px of the iframe height).
                We offset upward and clip the bottom (likes, comments, add comment bar).
              */}
              <div
                className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/10"
                style={{ aspectRatio: '9/16' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    /* Push the embed up so the video fills our container, hiding the likes/comments below */
                    marginTop: '-54px', // hides the top header bar of the embed
                    pointerEvents: 'none', // prevent interaction with clipped areas
                  }}
                >
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={`${reel.href}?utm_source=ig_embed`}
                    data-instgrm-version="14"
                    style={{
                      background: '#000',
                      border: 0,
                      margin: 0,
                      maxWidth: '100%',
                      minWidth: 0,
                      padding: 0,
                      width: '100%',
                    }}
                  />
                </div>
                {/* Re-enable pointer events only on the video area */}
                <div className="absolute inset-0" style={{ pointerEvents: 'auto' }} />
              </div>
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
