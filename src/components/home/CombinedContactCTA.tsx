'use client';

import { useState } from 'react';
import { MapPin, Phone, MessageCircle, ArrowRight, Navigation, Check } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CombinedContactCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          
          {/* Left Column - Contact Details & Map */}
          <ScrollReveal direction="up" className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Find Us
              </p>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground tracking-tight leading-none uppercase mb-2">
                Visit The <span className="text-wu-red">Studio</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               {/* Address */}
               <div className="flex-1 p-5 bg-muted/50 border border-border rounded-2xl">
                 <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-wu-red shrink-0 mt-1" />
                    <div>
                      <p className="font-display font-bold text-foreground text-sm leading-relaxed">
                        Medical More, Shibmandir<br />
                        Opp. Mukta Nursing Home<br />
                        Siliguri, WB 734011
                      </p>
                    </div>
                 </div>
               </div>

               {/* Phone */}
               <a href="tel:+916296396462" className="flex-1 p-5 bg-muted/50 border border-border rounded-2xl hover:border-wu-red/30 transition-colors flex items-center gap-4">
                 <Phone size={18} className="text-wu-red shrink-0" />
                 <div>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-1">Call Us</p>
                    <p className="font-display font-bold text-foreground text-sm tracking-wide">+91 62963 96462</p>
                 </div>
               </a>
            </div>

             {/* Small Map */}
            <div className="w-full flex-grow rounded-2xl overflow-hidden border border-border relative group min-h-[220px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.2140416954845!2d88.36538271503387!3d26.710126783214588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4474a7d906dcf%3A0x710e92abdd0f9ed6!2sWearup%20India!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="WearUp India - Siliguri Location"
              />
               <a
                  href="https://maps.google.com/?q=Wearup+India+Siliguri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-2 bg-wu-red text-white font-display font-bold text-[9px] tracking-widest uppercase shadow-lg hover:scale-105 transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                >
                  <Navigation size={10} />
                  Directions
                </a>
            </div>

          </ScrollReveal>

          {/* Right Column - Newsletter & WhatsApp */}
          <ScrollReveal direction="up" delay={0.2} className="h-full">
            <div className="relative rounded-3xl bg-muted/30 border border-border overflow-hidden p-8 sm:p-10 h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-wu-red/5 blur-[80px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-wu-red/30 bg-wu-red/5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-wu-red animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-wu-red uppercase">Community</span>
                </div>
                
                <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground leading-none tracking-tight mb-4 uppercase">
                  Join The Squad
                </h2>
                
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                  Subscribe for the latest drops, exclusive deals, and wrap inspiration.
                </p>

                <div className="flex flex-col gap-4">
                  {subscribed ? (
                    <div className="flex items-center gap-4 bg-wu-red/10 border border-wu-red/30 rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-full bg-wu-red flex items-center justify-center shrink-0">
                        <Check size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-foreground text-sm">You&apos;re Subscribed!</p>
                        <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">Watch your inbox for updates.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 min-w-0 bg-background border border-border rounded-2xl px-5 py-3.5 text-foreground placeholder-muted-foreground font-body text-sm focus:outline-none focus:border-wu-red/40 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        className="group px-6 py-3.5 bg-wu-red text-white rounded-2xl font-display font-bold text-xs tracking-widest uppercase hover:bg-wu-red-dark transition-colors flex items-center justify-center gap-2 shrink-0"
                      >
                        <span>Subscribe</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  )}

                  <div className="flex items-center gap-4 my-2 opacity-60">
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">Or</span>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <a
                    href="https://wa.me/916296396462?text=Hi%20WearUp!%20I%27d%20like%20to%20enquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl text-[#25D366] font-display font-bold text-sm tracking-wide hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-300 group"
                  >
                    <MessageCircle size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">Drop a message on WhatsApp</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
