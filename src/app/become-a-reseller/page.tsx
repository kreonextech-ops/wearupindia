import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, TrendingUp, Handshake } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const benefits = [
  {
    icon: ShoppingBag,
    title: 'Low MOQ',
    desc: 'Start small. We offer low Minimum Order Quantities so you can test the market without heavy upfront investment.'
  },
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    desc: 'Our graphic kits, keychains, and apparel are built to last. Resell products you can truly stand behind.'
  },
  {
    icon: TrendingUp,
    title: 'High Margins',
    desc: 'Enjoy competitive B2B pricing that gives you the room to make serious profit on every sale.'
  },
  {
    icon: Handshake,
    title: 'Dedicated Support',
    desc: 'Get priority assistance, marketing materials, and product training directly from our core team.'
  }
];

export default function ResellerPage() {
  return (
    <div className="min-h-screen pt-16 bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=80"
          alt="Reseller Program"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ScrollReveal direction="up">
            <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-4 font-bold">
              <span className="w-8 h-px bg-wu-red" /> Partner With Us
            </p>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6 uppercase">
              Become a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-wu-red to-wu-red-dark italic">Reseller</span>
            </h1>
            <p className="font-body text-zinc-400 max-w-xl text-base sm:text-lg leading-relaxed mb-8">
              Join the WearUp network. Sell our premium bike accessories, keychains, graphic kits, and rider merchandise. Earn high margins with a brand riders trust.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-white text-black font-display font-black text-sm tracking-widest uppercase px-8 py-4 hover:bg-wu-red hover:text-white transition-all rounded-full"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Why Partner With Us */}
      <section className="py-24 border-y border-white/5 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight">
              Why Partner With <span className="text-wu-red italic">WearUp?</span>
            </h2>
            <p className="font-body text-zinc-400 mt-4 max-w-2xl mx-auto">
              We make it easy for offline stores, workshops, and online creators to add an explosive new revenue stream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="p-8 bg-[#111] border border-white/5 hover:border-wu-red/30 transition-colors h-full group rounded-2xl">
                  <div className="w-12 h-12 bg-wu-red/10 text-wu-red rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-wu-red group-hover:text-white transition-all">
                    <b.icon size={24} />
                  </div>
                  <h3 className="font-display font-black text-xl mb-3">{b.title}</h3>
                  <p className="font-body text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories We Offer */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4">// Product Portfolio</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight mb-6">
                What you can <span className="text-wu-red italic">Sell</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Graphic Kits', desc: 'Precision-cut, weather-proof decals for popular motorcycles.' },
                  { title: 'Bike Accessories', desc: 'High-performance upgrades, luggage, and protection gear.' },
                  { title: 'Rider Merchandise', desc: 'Premium t-shirts, hoodies, and lifestyle apparel.' },
                  { title: 'Keychains & Extras', desc: 'High-quality metal & leather keychains perfect for impulse buys.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-white/5 bg-white/[0.02] rounded-xl hover:border-wu-red/20 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-wu-red/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-wu-red" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-3xl overflow-hidden border border-white/10 hidden lg:block">
              <Image 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" 
                alt="Products" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-wu-red py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            Ready to Start <span className="italic">Earning?</span>
          </h2>
          <p className="font-body text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Drop us a message with your business details (shop name, location, and what you want to sell). Our B2B team will get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-wu-red font-display font-black text-sm tracking-widest uppercase px-10 py-5 hover:bg-black hover:text-white transition-all rounded-full"
          >
            Contact B2B Sales <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
