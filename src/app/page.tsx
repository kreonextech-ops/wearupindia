import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { ArrowRight, ArrowUpRight, Shield, Truck, RotateCcw, Phone, Sparkles, Paintbrush } from 'lucide-react';
import { categories, products, brands, services, testimonials, formatPrice } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BrandMarquee from '@/components/home/BrandMarquee';
import StatsBar from '@/components/home/StatsBar';
import TestimonialsSection from '@/components/home/Testimonials';
import InstagramReels from '@/components/home/InstagramReels';
import NewsletterCTA from '@/components/home/NewsletterCTA';

export default function Home() {
  const newArrivals = products.filter(p => p.isNew).reverse().slice(0, 5);
  const featuredKits = products.filter(p => !p.isNew).slice(0, 5);
  const wrappingService = services.find(s => s.slug === 'bike-wrapping');
  const washService = services.find(s => s.slug === 'premium-wash');
  const ppfService = services.find(s => s.slug === 'ppf-protection');

  return (
    <main className="bg-background text-foreground transition-colors duration-500">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=80"
            alt="WearUp Hero – Superbike"
            fill
            className="object-cover opacity-[0.35] scale-105 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          {/* Red glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E8161B]/8 blur-[150px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-20">
          <ScrollReveal direction="down" duration={0.8}>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-border bg-background/40 backdrop-blur-md rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-wu-red animate-pulse" />
              <span className="font-mono text-[10px] text-foreground tracking-[0.25em] uppercase">Premium Motorcycle Customization</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-[0.8] tracking-tighter uppercase mb-6 drop-shadow-2xl">
              Ride <span className="text-wu-red">Bold.</span><br />
              <span className="text-foreground">Wrap</span> Louder.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} className="max-w-xl mx-auto">
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
              India&apos;s most aggressive motorcycle aesthetics haven. Custom wraps, precision detailing, and performance gear.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              href="/shop" 
              className="group relative px-10 py-5 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(232,22,27,0.3)]"
              style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
            >
              Explore Shop <ArrowRight size={14} className="inline ml-2" />
            </Link>
            <Link 
              href="/services" 
              className="px-10 py-5 border border-border bg-background/5 text-foreground font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-foreground/10"
              style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
            >
              Our Services
            </Link>
          </ScrollReveal>

          {/* Scroll indicator */}
          <ScrollReveal direction="up" delay={1.0}>
            <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground/20">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted-foreground/20 to-muted-foreground/40 animate-pulse" />
              <span className="font-mono text-[8px] tracking-[0.4em] uppercase">Scroll</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <StatsBar />

      {/* ─── BRAND MARQUEE ─── */}
      <BrandMarquee />

      {/* ─── SHOP BY CATEGORY (BENTO) ─── */}
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Categories
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tight leading-none uppercase">Shop by Category</h2>
            </div>
            <Link href="/shop" className="flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
              <span className="font-display font-bold text-[11px] tracking-widest uppercase">View All Categories</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px] md:auto-rows-[320px]">
          {categories.map((cat, i) => {
            const isComingSoon = cat.isComingSoon;
            const cardSpans = [
              'md:col-span-8 md:row-span-2', // Graphic Kits
              'md:col-span-4 md:row-span-1', // Bike Accessories
              'md:col-span-4 md:row-span-1', // Keychains
              'md:col-span-6 md:row-span-1', // T-Shirts
              'md:col-span-6 md:row-span-1', // Hoodies
            ];

            return (
              <ScrollReveal 
                key={cat.slug} 
                direction="up" 
                delay={i * 0.1} 
                className={`${cardSpans[i] || 'md:col-span-4'} rounded-2xl overflow-hidden relative group border border-border shadow-2xl`}
              >
                <div className={`relative w-full h-full ${isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}>
                  {isComingSoon ? (
                    <div className="w-full h-full relative">
                      {/* Premium Teaser Background */}
                      <SafeImage
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover opacity-60 transition-transform duration-[3000ms] group-hover:scale-110"
                      />
                      
                      {/* Glassmorphic Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="h-px w-8 bg-wu-red" />
                          <p className="font-mono text-[9px] text-wu-red tracking-[0.4em] uppercase font-black">Teaser</p>
                        </div>
                        
                        <h3 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground mb-3 uppercase tracking-tighter leading-none group-hover:text-wu-red transition-colors duration-500">
                          {cat.name}
                        </h3>
                        
                        <p className="font-body text-muted-foreground text-xs max-w-[240px] leading-relaxed mb-8 opacity-80">
                          {cat.description}
                        </p>
                        
                        {/* Notify Me - Visual Only */}
                        <div className="flex items-center gap-4">
                          <div className="px-6 py-2 border border-wu-red/30 bg-wu-red/5 text-wu-red font-display font-bold text-[9px] tracking-[0.2em] uppercase rounded-full backdrop-blur-md">
                            Coming Soon
                          </div>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 p-6 z-20 opacity-20">
                        <div className="w-12 h-12 border-t-2 border-r-2 border-wu-red" />
                      </div>
                    </div>
                  ) : (
                    <Link href={`/shop/${cat.slug}`} className="block w-full h-full">
                      <SafeImage
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 z-20">
                        <p className="font-mono text-[10px] text-wu-red tracking-widest uppercase mb-2 bg-wu-red/10 w-max px-3 py-1 rounded-full border border-wu-red/20">{cat.tagline}</p>
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-1 uppercase tracking-tighter">{cat.name}</h3>
                        <p className="font-body text-muted-foreground text-sm max-w-xs">{cat.description}</p>
                      </div>
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-2xl">
                        <ArrowUpRight size={22} />
                      </div>
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-24 px-4 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex items-center justify-between mb-16">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-3">// Just In</p>
              <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic">New Products</h2>
            </div>
            <Link href="/shop" className="flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
              <span className="font-display font-bold text-[11px] tracking-widest uppercase">Explore All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {newArrivals.map((product, i) => (
              <ScrollReveal 
                key={product.id} 
                direction="up" 
                delay={i * 0.07}
                className={i === 4 ? 'hidden lg:block' : ''}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (ONE ROW) ─── */}
      <section className="py-24 px-4 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex items-center justify-between mb-16">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-3">// Curated Gear</p>
              <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic">Featured Kits</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
              <span className="font-display font-bold text-[11px] tracking-widest uppercase">View All Shop</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {featuredKits.map((product, i) => (
              <ScrollReveal 
                key={product.id} 
                direction="up" 
                delay={i * 0.07}
                className={i === 4 ? 'hidden lg:block' : ''}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPACT SERVICES ─── */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Our Services
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tight leading-none uppercase">Expert Services</h2>
            </div>
            <Link href="/services" className="flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
              <span className="font-display font-bold text-[11px] tracking-widest uppercase">View All Services</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Wrapping - Full Width */}
          <ScrollReveal direction="up" className="lg:col-span-2 relative h-[220px] sm:h-[260px] rounded-[2rem] overflow-hidden group">
            <SafeImage
              src={wrappingService?.image || ''}
              alt="Wrapping"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-wu-red/20 border border-wu-red/30 flex items-center justify-center shrink-0">
                  <Paintbrush className="text-wu-red" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">{wrappingService?.name}</h3>
                  <p className="font-mono text-[9px] text-wu-red tracking-widest uppercase truncate">{wrappingService?.tagline}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <Link
                  href={`/services/${wrappingService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-7 py-3 bg-white text-black font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-wu-red hover:text-white transition-all duration-500"
                >
                  Get a Quote <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="font-display font-bold text-white/50 text-sm whitespace-nowrap">{wrappingService?.price}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Wash - Half Width */}
          <ScrollReveal direction="up" delay={0.1} className="relative h-[220px] sm:h-[260px] rounded-[2rem] overflow-hidden group">
            <SafeImage
              src={washService?.image || ''}
              alt="Detail Wash"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end items-start">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-wu-red/20 border border-wu-red/30 flex items-center justify-center shrink-0">
                  <Sparkles className="text-wu-red" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">{washService?.name}</h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full">
                <Link
                  href={`/services/${washService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-5 py-3 border border-white/20 bg-black/50 backdrop-blur-md text-white font-display font-bold text-[10px] tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500"
                >
                  Book <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* PPF - Half Width */}
          <ScrollReveal direction="up" delay={0.15} className="relative h-[220px] sm:h-[260px] rounded-[2rem] overflow-hidden group">
            <SafeImage
              src={ppfService?.image || ''}
              alt="PPF Protection"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end items-start">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-wu-red/20 border border-wu-red/30 flex items-center justify-center shrink-0">
                  <Shield className="text-wu-red" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">{ppfService?.name}</h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full">
                <Link
                  href={`/services/${ppfService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-5 py-3 border border-white/20 bg-black/50 backdrop-blur-md text-white font-display font-bold text-[10px] tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500"
                >
                  Enquire <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* EXPLORE MORE BUTTON */}
        <ScrollReveal direction="up" delay={0.2} className="mt-12 flex justify-center">
          <Link 
            href="/services" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(232,22,27,0.2)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
          >
            Explore More Services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </section>

      {/* ─── INSTAGRAM REELS ─── */}
      <InstagramReels />

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialsSection />

      {/* ─── NEWSLETTER + WHATSAPP ─── */}
      <NewsletterCTA />

      {/* ─── TRUST BADGES ─── */}
      <section className="py-16 border-t border-border bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: 'Pan-India', sub: 'Express Shipping' },
              { icon: Shield, label: 'Certified', sub: '3M & Avery Dennison' },
              { icon: RotateCcw, label: 'Returns', sub: 'Hassle-free 7 days' },
              { icon: Phone, label: 'Customer Care', sub: 'Always here to help' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <ScrollReveal direction="up" delay={i * 0.1} key={label} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center mb-4 group-hover:border-wu-red/40 transition-colors">
                  <Icon size={20} className="text-muted-foreground group-hover:text-wu-red transition-colors" />
                </div>
                <h4 className="font-display font-bold text-base text-foreground mb-1">{label}</h4>
                <p className="font-body text-xs text-muted-foreground">{sub}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
