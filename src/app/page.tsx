import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Shield, Truck, RotateCcw, Phone, Sparkles, Paintbrush } from 'lucide-react';
import { categories, products, brands, services, testimonials, formatPrice } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BrandMarquee from '@/components/home/BrandMarquee';
import StatsBar from '@/components/home/StatsBar';
import TestimonialsSection from '@/components/home/Testimonials';
import NewsletterCTA from '@/components/home/NewsletterCTA';

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const wrappingService = services.find(s => s.slug === 'bike-wrapping');
  const washService = services.find(s => s.slug === 'detail-wash');

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-[#E8161B] selection:text-white">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=80"
            alt="WearUp Hero – Superbike"
            fill
            className="object-cover opacity-[0.35] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/20 to-[#0A0A0A]" />
          {/* Red glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E8161B]/8 blur-[150px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-20">
          <ScrollReveal direction="down" duration={0.8}>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#2a2a2a] bg-black/40 backdrop-blur-md rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-[#E8161B] animate-pulse" />
              <span className="font-mono text-[10px] text-white tracking-[0.25em] uppercase">Premium Moto Aesthetics</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} duration={1}>
            <h1 className="font-display font-black leading-[0.85] tracking-tighter">
              <span className="block text-[clamp(4rem,15vw,9.5rem)] text-white drop-shadow-2xl">RIDE BOLD.</span>
              <span className="block text-[clamp(4rem,15vw,9.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#E8161B] to-[#ff4b4f] italic pr-4">WRAP LOUDER.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="font-body text-[#888] max-w-lg mx-auto text-base sm:text-lg leading-relaxed mt-8 mb-12">
              Engineering high-performance vinyl wraps, tactical gear, and protective ceramic coatings for the modern Indian rider.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-10 py-5 overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              >
                <div className="absolute inset-0 w-full h-full bg-white/15 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">Explore Collection</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-3 border border-[#333] bg-black/50 backdrop-blur-md text-white font-display font-bold text-sm tracking-widest uppercase px-10 py-5 hover:border-white/30 transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              >
                Book The Pit Stop
              </Link>
            </div>
          </ScrollReveal>

          {/* Scroll indicator */}
          <ScrollReveal direction="up" delay={1.0}>
            <div className="mt-20 flex flex-col items-center gap-2 text-white/20">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-white/40 animate-pulse" />
              <span className="font-mono text-[8px] tracking-[0.4em] uppercase">Scroll</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <StatsBar />

      {/* ─── BRAND MARQUEE ─── */}
      <BrandMarquee />

      {/* ─── FEATURED PRODUCTS (4x2 GRID) ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#E8161B]" /> Featured
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight leading-none">THE TOP LIST</h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-[#E8161B] font-display font-bold text-xs tracking-[0.2em] uppercase self-start md:self-auto">
              Enter Store <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product, i) => (
            <ScrollReveal key={product.id} direction="up" delay={i * 0.07}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY (BENTO) ─── */}
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#E8161B]" /> Categories
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight leading-none">DEPARTMENT</h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px] md:auto-rows-[360px]">
          {/* Large card */}
          <ScrollReveal direction="up" className="md:col-span-8 rounded-2xl overflow-hidden relative group">
            <Link href={`/shop/${categories[0].slug}`} className="block w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                alt={categories[0].name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <p className="font-mono text-[10px] text-[#E8161B] tracking-widest uppercase mb-2 bg-black/50 w-max px-3 py-1 rounded-full">{categories[0].tagline}</p>
                <h3 className="font-display font-black text-4xl sm:text-5xl text-white mb-1">{categories[0].name}</h3>
                <p className="font-body text-white/40 text-sm max-w-xs">{categories[0].description.slice(0, 70)}...</p>
              </div>
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 rotate-45 group-hover:rotate-0 transition-all duration-500">
                <ArrowUpRight size={20} />
              </div>
            </Link>
          </ScrollReveal>

          {/* Medium card */}
          <ScrollReveal direction="up" delay={0.1} className="md:col-span-4 rounded-2xl overflow-hidden relative group">
            <Link href={`/shop/${categories[1].slug}`} className="block w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80"
                alt={categories[1].name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-1">{categories[1].tagline}</p>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-3xl text-white">{categories[1].name}</h3>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Wide card */}
          <ScrollReveal direction="up" delay={0.2} className="md:col-span-12 rounded-2xl overflow-hidden relative group" style={{ height: '240px' }}>
            <Link href={`/shop/${categories[2].slug}`} className="block w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1600&q=80"
                alt={categories[2].name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
              <div className="absolute inset-y-0 left-0 p-10 flex flex-col justify-center">
                <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2">{categories[2].tagline}</p>
                <h3 className="font-display font-black text-4xl text-white mb-3">{categories[2].name}</h3>
                <span className="inline-flex items-center gap-2 text-[#E8161B] font-display font-bold text-xs tracking-widest uppercase group-hover:gap-4 transition-all duration-300">
                  Shop Now <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── COMPACT SERVICES ─── */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#E8161B]" /> The Lab
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight leading-none">PROFESSIONAL CARE</h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          {/* Wrapping */}
          <ScrollReveal direction="up" className="relative h-[220px] sm:h-[260px] rounded-3xl overflow-hidden group">
            <Image
              src={wrappingService?.image || ''}
              alt="Wrapping"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8161B]/20 border border-[#E8161B]/30 flex items-center justify-center">
                  <Paintbrush className="text-[#E8161B]" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">{wrappingService?.name}</h3>
                  <p className="font-mono text-[9px] text-[#E8161B] tracking-widest uppercase">{wrappingService?.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href={`/services/${wrappingService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-7 py-3 bg-white text-black font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-[#E8161B] hover:text-white transition-all duration-500"
                >
                  Inquire Now <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="font-display font-bold text-white/50 text-sm">{wrappingService?.price}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Wash */}
          <ScrollReveal direction="up" delay={0.15} className="relative h-[220px] sm:h-[260px] rounded-3xl overflow-hidden group">
            <Image
              src={washService?.image || ''}
              alt="Detail Wash"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center items-end text-right">
              <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-xl bg-[#E8161B]/20 border border-[#E8161B]/30 flex items-center justify-center">
                  <Sparkles className="text-[#E8161B]" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">{washService?.name}</h3>
                  <p className="font-mono text-[9px] text-[#E8161B] tracking-widest uppercase">{washService?.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-row-reverse">
                <Link
                  href={`/services/${washService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-7 py-3 border border-white/20 bg-black/50 backdrop-blur-md text-white font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500"
                >
                  Book Wash <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="font-display font-bold text-white/50 text-sm">{washService?.price}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialsSection />

      {/* ─── NEWSLETTER + WHATSAPP ─── */}
      <NewsletterCTA />

      {/* ─── TRUST BADGES ─── */}
      <section className="py-16 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: 'Pan-India', sub: 'Express Shipping' },
              { icon: Shield, label: 'Certified', sub: '3M & Avery Dennison' },
              { icon: RotateCcw, label: 'Returns', sub: 'Hassle-free 7 days' },
              { icon: Phone, label: '24/7 Crew', sub: 'Always online' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <ScrollReveal direction="up" delay={i * 0.1} key={label} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 bg-white/[0.03] border border-white/8 rounded-2xl flex items-center justify-center mb-4 group-hover:border-[#E8161B]/40 transition-colors">
                  <Icon size={20} className="text-white/50 group-hover:text-[#E8161B] transition-colors" />
                </div>
                <h4 className="font-display font-bold text-base text-white mb-1">{label}</h4>
                <p className="font-body text-xs text-[#555]">{sub}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
