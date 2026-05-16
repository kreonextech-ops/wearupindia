'use client';

import { Star, Quote, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { testimonials } from '@/data';

// Tripled for seamless infinite CSS marquee
const items = [...testimonials, ...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Reviews
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tight leading-none">
                CUSTOMER<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-wu-red to-[#ff4b4f]">REVIEWS</span>
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="flex flex-col items-start md:items-end gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} fill="#E8161B" className="text-wu-red" />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">4.9 / 5 · Google Reviews</p>
              </div>
              <a 
                href="https://share.google/w1mCZyI0nJt7K717G" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 border border-border bg-muted/50 rounded-full hover:border-wu-red/40 hover:bg-wu-red/5 transition-all text-sm font-display font-bold text-foreground"
              >
                Read all on Google
                <ExternalLink size={14} className="text-muted-foreground group-hover:text-wu-red transition-colors" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Marquee container */}
        <div className="relative mt-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 testimonials-marquee" style={{ width: 'max-content' }}>
            {items.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="relative flex flex-col bg-card border border-border rounded-[2.5rem] p-8 h-[280px] w-[380px] shrink-0 hover:border-wu-red/20 transition-all duration-500 group/card overflow-hidden select-none"
              >
                {/* Background glow */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-wu-red/5 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Quote Icon */}
                <div className="absolute top-8 right-10 opacity-10 group-hover/card:opacity-20 transition-opacity duration-500">
                  <Quote size={48} className="text-wu-red" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} fill="#E8161B" className="text-wu-red" />
                  ))}
                </div>

                {/* Text */}
                <p className="font-body text-foreground/80 leading-relaxed text-[13px] flex-1 mb-6 line-clamp-4">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-wu-red/10 border border-wu-red/20 flex items-center justify-center shrink-0">
                    <span className="font-display font-black text-sm text-wu-red">
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">{t.name}</p>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-1 truncate">
                      {t.role}
                    </p>
                  </div>
                  {/* Google badge */}
                  <div className="shrink-0 flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border">
                    <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Review</span>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-wu-red/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Animated indicator bar */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="w-12 h-1 rounded-full bg-wu-red/20 overflow-hidden">
            <motion.div
              className="h-full bg-wu-red"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.4em] uppercase">
            Auto-sliding
          </p>
        </div>
      </div>

      {/* CSS Marquee animation */}
      <style jsx>{`
        .testimonials-marquee {
          animation: marquee-scroll 60s linear infinite;
        }
        .testimonials-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-380px * ${testimonials.length} - 6px * ${testimonials.length})); }
        }
      `}</style>
    </section>
  );
}
