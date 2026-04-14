'use client';

import { Star, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { testimonials } from '@/data';

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
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={16} fill="#E8161B" className="text-wu-red" />
                ))}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">4.9 / 5 · 1,200+ Reviews</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} direction="up" delay={i * 0.15}>
              <div className="relative flex flex-col bg-card border border-border rounded-3xl p-8 h-full hover:border-wu-red/20 transition-all duration-500 group overflow-hidden">
                {/* Background glow */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-wu-red/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Quote */}
                <Quote size={28} className="text-wu-red/20 mb-5 group-hover:text-wu-red/40 transition-colors duration-500" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={11} fill="#E8161B" className="text-wu-red" />
                  ))}
                </div>

                {/* Text */}
                <p className="font-body text-muted-foreground leading-relaxed text-sm flex-1 mb-8">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-10 h-10 rounded-full bg-wu-red/10 border border-wu-red/20 flex items-center justify-center shrink-0">
                    <span className="font-display font-black text-sm text-wu-red">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                    <p className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase mt-0.5">
                      {t.role} · {t.city}
                    </p>
                  </div>
                  {/* Verified badge */}
                  <div className="ml-auto">
                    <span className="font-mono text-[7px] tracking-widest uppercase text-wu-red/60 border border-wu-red/20 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-wu-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
