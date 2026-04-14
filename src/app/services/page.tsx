'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Check, Shield, Zap, Droplets } from 'lucide-react';
import { services } from '@/data';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-20 bg-background text-foreground transition-colors duration-500">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative py-24 overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--wu-red) 0, var(--wu-red) 1px, transparent 0, transparent 50%)', backgroundSize: '30px 30px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <ScrollReveal direction="down">
            <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-4 flex items-center justify-center sm:justify-start gap-3">
              <span className="w-10 h-px bg-wu-red" /> Professional Care
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-[0.85] tracking-tighter uppercase mb-6">
              Precision<br />
              <span className="text-wu-red italic">Aesthetics.</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.2} className="max-w-xl">
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
              We don&apos;t just care for vehicles — we refine them. From advanced heat-formed wraps to clinical-grade ceramic protection, we set the gold standard for Indian roads.
            </p>
          </ScrollReveal>
        </div>
        
        {/* Floating gradient orb */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-wu-red/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ─── SERVICES GRID ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 divide-y divide-border">
        {services.map((service, i) => (
          <section key={service.slug} className={`py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <ScrollReveal direction={i % 2 === 0 ? 'right' : 'left'} className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-square rounded-3xl overflow-hidden group">
                <Image 
                  src={service.image} 
                  alt={service.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                
                {/* Visual Accent */}
                <div className="absolute top-6 left-6 p-4 bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-wu-red/20 flex items-center justify-center text-wu-red">
                    {i === 0 ? <Zap size={18} /> : i === 1 ? <Droplets size={18} /> : <Shield size={18} />}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-8">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] text-wu-red tracking-widest uppercase px-3 py-1 bg-wu-red/10 rounded-full border border-wu-red/20">
                    Step {service.process.length} Process
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground tracking-tighter leading-none mb-4 uppercase">
                  {service.name}
                </h2>
                <p className="font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </ScrollReveal>

              {/* Pricing Grid */}
              <ScrollReveal direction="up" delay={0.1}>
                {service.subPrices ? (
                  <div className="grid grid-cols-2 gap-4">
                    {service.subPrices.map((sp) => (
                      <div key={sp.label} className="p-5 bg-muted/50 border border-border rounded-2xl group hover:border-wu-red/50 transition-colors">
                        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{sp.label}</p>
                        <p className="font-display font-black text-2xl text-foreground">{sp.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="inline-block p-5 bg-muted/50 border border-border rounded-2xl">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Starting From</p>
                    <p className="font-display font-black text-3xl text-wu-red">{service.price}</p>
                  </div>
                )}
              </ScrollReveal>

              {/* Multi-stage process preview */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs tracking-widest uppercase text-foreground/40">The Process</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {service.process.map((step) => (
                      <div key={step.step} className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] text-wu-red font-bold">{step.step}</span>
                        <span className="font-display font-black text-[10px] uppercase tracking-tighter truncate">{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3} className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-3 bg-wu-red text-white font-display font-bold text-xs tracking-widest uppercase px-8 py-4 hero-clip transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(232,22,27,0.2)]"
                >
                  View Workflow <ArrowRight size={14} />
                </Link>
                <div className="flex items-center gap-2 text-muted-foreground/40 font-mono text-[10px] tracking-widest uppercase ml-auto">
                  <Clock size={12} />
                  <span>Est: {service.duration}</span>
                </div>
              </ScrollReveal>
            </div>
          </section>
        ))}
      </div>

      {/* ─── CALL TO ACTION ─── */}
      <section className="py-24 px-4 bg-muted/30 border-t border-border overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground leading-[0.9] tracking-tighter uppercase mb-8">
              Ready to <span className="text-wu-red italic">Level Up</span><br />Your Machine?
            </h2>
            <p className="font-body text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Slots fill up fast for seasonal detailing and full wraps. Contact us today to get a custom quote and timeline.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-foreground text-background font-display font-black text-sm tracking-widest uppercase transition-all duration-500 hover:bg-wu-red hover:text-white"
            >
              Consult with Experts <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
        
        {/* Red glow backdrop */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-wu-red/10 blur-[150px] rounded-full" />
      </section>
    </div>
  );
}
