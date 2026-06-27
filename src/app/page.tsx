import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { ArrowRight, ArrowUpRight, Shield, Truck, Lock, Phone, Sparkles, Paintbrush } from 'lucide-react';
import { categories, products, brands, services, testimonials, formatPrice } from '@/data';
import { getAssetUrl } from '@/lib/assets';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SequentialVideoPlayer from '@/components/ui/SequentialVideoPlayer';
import BrandMarquee from '@/components/home/BrandMarquee';
import BikeSelector from '@/components/home/BikeSelector';
import StatsBar from '@/components/home/StatsBar';
import TestimonialsSection from '@/components/home/Testimonials';
import InstagramReels from '@/components/home/InstagramReels';
import CombinedContactCTA from '@/components/home/CombinedContactCTA';
import OurCustomers from '@/components/home/OurCustomers';

import HeroVideo from '@/components/home/HeroVideo';
import { getAllProductsAction } from '@/app/admin/products/actions';

export default async function Home() {
  const res = await getAllProductsAction();
  const dbProducts = res.success && res.data ? res.data : [];
  
  const newArrivals = dbProducts.filter(p => p.is_new).slice(0, 5);
  const featuredKits = dbProducts.filter(p => p.is_featured).slice(0, 5);
  
  const wrappingService = services.find(s => s.slug === 'bike-wrapping');
  const washService = services.find(s => s.slug === 'premium-wash');
  const ppfService = services.find(s => s.slug === 'ppf-protection');

  return (
    <main className="bg-background text-foreground transition-colors duration-500">

      {/* ─── HERO ─── */}
      <section className="relative pt-16 md:pt-20 min-h-[50vh] md:min-h-[60vh] flex flex-col md:flex-row overflow-hidden bg-black">
        {[
          {
            id: 'wrap-3',
            src: getAssetUrl('/videos/hero-video-3.mp4'),
            poster: '/hero/1.jpg',
            title: 'Premium Finish'
          },
          {
            id: 'wrap-untitled',
            src: getAssetUrl('/videos/hero-video-untitled.mp4'),
            poster: '/hero/2.jpg',
            title: 'Rider Style'
          },
          {
            id: 'wrap-1',
            src: getAssetUrl('/videos/hero-video-1.mp4'),
            poster: '/hero/3.jpg',
            title: 'Precision Wraps'
          }
        ].map((panel, idx) => (
          <div 
            key={panel.id}
            className={`group relative flex-1 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden transition-all duration-700 ${idx === 0 ? 'min-h-[40vh] md:min-h-[60vh]' : 'hidden md:block md:min-h-[60vh]'}`}
          >
            {/* Video Background with Poster Crossfade */}
            {idx === 0 ? (
              <>
                {/* Mobile: Sequential playback */}
                <div className="md:hidden absolute inset-0">
                  <SequentialVideoPlayer 
                    sources={[
                      getAssetUrl('/videos/hero-video-3.mp4'),
                      getAssetUrl('/videos/hero-video-untitled.mp4'),
                      getAssetUrl('/videos/hero-video-1.mp4')
                    ]}
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                {/* Desktop: Continuous loop with Poster */}
                <HeroVideo 
                  src={panel.src}
                  poster={panel.poster}
                  className="hidden md:block absolute inset-0 w-full h-full"
                />
              </>
            ) : (
              <HeroVideo 
                src={panel.src}
                poster={panel.poster}
                className="absolute inset-0 w-full h-full"
              />
            )}

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 pointer-events-none" />

            
            {/* Minimal Brand Overlay - Only on first panel */}
            {idx === 0 && (
              <div className="absolute bottom-12 left-8 sm:left-12 z-20">
                 <ScrollReveal direction="up" delay={0.2}>
                   <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[0.85] tracking-tighter uppercase text-white mb-6 drop-shadow-2xl">
                      Ride <span className="text-wu-red">Bold.</span><br />
                      <span className="text-white">Wrap</span> Louder.
                    </h1>
                    <div className="flex gap-4">
                       <Link href="/shop" className="px-6 py-3 bg-wu-red text-white font-display font-bold text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-lg">Explore</Link>
                       <Link href="/services" className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-display font-bold text-[10px] tracking-widest uppercase hover:bg-white/20 transition-all">Services</Link>
                    </div>
                 </ScrollReveal>
              </div>
            )}


            
            {/* Bottom Progress Bar Indicator for Panel Index */}
            <div className="absolute bottom-0 left-0 h-1 bg-wu-red/30 w-full opacity-30">
               <div className={`h-full bg-wu-red transition-all duration-1000 ${idx === 0 ? 'w-full' : 'w-0'}`} />
            </div>
          </div>
        ))}
      </section>

      {/* ─── BRAND MARQUEE (New Thin Strip) ─── */}
      <BrandMarquee />

      {/* ─── BIKE SELECTOR (Find Your Fit) ─── */}
      <BikeSelector />

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
              'md:col-span-7 md:row-span-2', // Graphic Kits
              'md:col-span-5 md:row-span-2', // Bike Accessories
              'md:col-span-4 md:row-span-1', // Keychains
              'md:col-span-4 md:row-span-1', // T-Shirts
              'md:col-span-4 md:row-span-1', // Hoodies
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
                        
                        <p className="font-body text-white/80 text-sm max-w-xs leading-relaxed mb-8">
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
                      {cat.slug === 'graphic-kits' || cat.slug === 'bike-accessories' ? (
                        <div className="absolute inset-0 overflow-hidden">
                          {cat.slug === 'graphic-kits' ? (
                            <SequentialVideoPlayer 
                              sources={[
                                getAssetUrl("/videos/categories/graphic-kits-1.mp4"),
                                getAssetUrl("/videos/categories/graphic-kits-2.mp4")
                              ]}
                              className="w-full h-full object-cover opacity-70"
                            />
                          ) : (
                            <video 
                              autoPlay muted loop playsInline 
                              className="w-full h-full object-cover opacity-70"
                            >
                              <source src={getAssetUrl("/videos/categories/bike-accessories.mp4")} type="video/mp4" />
                            </video>
                          )}
                        </div>
                      ) : (
                        <SafeImage
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
                      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 z-20">
                        <p className="font-mono text-[10px] text-wu-red tracking-widest uppercase mb-2 bg-wu-red/10 backdrop-blur-sm w-max px-3 py-1 rounded-full border border-wu-red/20">{cat.tagline}</p>
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-white mb-2 uppercase tracking-tighter drop-shadow-lg">{cat.name}</h3>
                        <p className="font-body text-white/80 text-sm max-w-2xl drop-shadow-md">{cat.description}</p>
                      </div>
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-2xl">
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
            <Link href="/shop/new-arrivals" className="flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
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
              <p className="font-mono text-[11px] text-wu-red tracking-[0.4em] uppercase mb-3">// The Elite Selection</p>
              <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic">Featured Kits</h2>
            </div>
            <Link href="/shop/featured" className="hidden sm:flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors">
              <span className="font-display font-bold text-[11px] tracking-widest uppercase">View All Featured</span>
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
          {/* Wrapping - Half Width */}
          <ScrollReveal direction="up" className="relative h-[450px] lg:h-[600px] rounded-[2.5rem] overflow-hidden group">
            <video 
              autoPlay muted loop playsInline 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 opacity-60"
            >
              <source src={getAssetUrl("/videos/services/bike-wrapping.mp4")} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end items-start">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-wu-red/20 border border-wu-red/30 flex items-center justify-center shrink-0">
                  <Paintbrush className="text-wu-red" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">{wrappingService?.name}</h3>
                  <p className="font-mono text-[9px] text-wu-red tracking-widest uppercase truncate">{wrappingService?.tagline}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 w-full">
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

          {/* PPF - Half Width */}
          <ScrollReveal direction="up" delay={0.15} className="relative h-[450px] lg:h-[600px] rounded-[2.5rem] overflow-hidden group">
            <SequentialVideoPlayer 
              sources={[
                getAssetUrl("/videos/services/ppf-1.mp4"), 
                getAssetUrl("/videos/services/ppf-2.mp4")
              ]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end items-start">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-wu-red/20 border border-wu-red/30 flex items-center justify-center shrink-0">
                  <Shield className="text-wu-red" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">{ppfService?.name}</h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full">
                <Link
                  href={`/services/${ppfService?.slug}`}
                  className="group/btn inline-flex items-center gap-2 px-7 py-3 border border-white/20 bg-black/50 backdrop-blur-md text-white font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500"
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

      {/* ─── OUR CUSTOMERS ─── */}
      <OurCustomers />

      {/* ─── INSTAGRAM REELS ─── */}
      <InstagramReels />

      {/* ─── STATS BAR ─── */}
      <StatsBar />

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialsSection />

      {/* ─── CONTACT + NEWSLETTER ─── */}
      <CombinedContactCTA />

      {/* ─── TRUST BADGES ─── */}
      <section className="py-8 border-t border-border bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Pan-India', sub: 'Express Shipping' },
              { icon: Shield, label: 'Certified', sub: '3M & Avery Dennison' },
              { icon: Lock, label: 'Secure Checkout', sub: '100% Safe Payments' },
              { icon: Phone, label: 'Customer Care', sub: 'Always here to help' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <ScrollReveal direction="up" delay={i * 0.1} key={label} className="flex items-center gap-3 group cursor-default">
                <div className="w-9 h-9 bg-background border border-border rounded-xl flex items-center justify-center shrink-0 group-hover:border-wu-red/40 transition-colors">
                  <Icon size={16} className="text-muted-foreground group-hover:text-wu-red transition-colors" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground leading-tight">{label}</h4>
                  <p className="font-body text-[11px] text-muted-foreground">{sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
