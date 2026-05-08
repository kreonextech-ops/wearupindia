'use client';

import { useState } from 'react';
import { MapPin, Phone, MessageCircle, ArrowRight, Navigation, Check, Loader2 } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { submitFormAction } from '@/lib/actions/forms';

export default function CombinedContactCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitting(true);
      await submitFormAction({
        name: 'Subscriber',
        email: email,
        message: 'Subscribed to newsletter via Combined Contact CTA',
        type: 'contact',
        metadata: { source: 'newsletter' }
      });
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">

          {/* Left Column - BIG MAP */}
          <ScrollReveal direction="up" className="min-h-[420px] lg:min-h-0">
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border min-h-[420px]">
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
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2.5 bg-wu-red text-white font-display font-bold text-[9px] tracking-widest uppercase shadow-lg hover:scale-105 transition-all"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <Navigation size={11} />
                Get Directions
              </a>
            </div>
          </ScrollReveal>

          {/* Right Column - Address, Phone, then Newsletter + WhatsApp */}
          <ScrollReveal direction="up" delay={0.2} className="flex flex-col gap-4">

            {/* Visit The Studio header */}
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Find Us
              </p>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight leading-none uppercase">
                Visit The <span className="text-wu-red">Studio</span>
              </h2>
            </div>

            {/* Address + Phone row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 p-4 bg-muted/50 border border-border rounded-2xl flex items-start gap-3">
                <MapPin size={16} className="text-wu-red shrink-0 mt-0.5" />
                <p className="font-body text-foreground text-xs leading-relaxed">
                  Medical More, Shibmandir<br />
                  Opp. Mukta Nursing Home<br />
                  Siliguri, WB 734011
                </p>
              </div>
              <a href="tel:+916296396462" className="flex-1 p-4 bg-muted/50 border border-border rounded-2xl hover:border-wu-red/30 transition-colors flex items-center gap-3">
                <Phone size={16} className="text-wu-red shrink-0" />
                <div>
                  <p className="font-mono text-[8px] text-muted-foreground tracking-[0.2em] uppercase mb-0.5">Call Us</p>
                  <p className="font-display font-bold text-foreground text-sm">+91 62963 96462</p>
                </div>
              </a>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 opacity-50">
              <div className="h-px bg-border flex-1" />
              <span className="font-mono text-[8px] text-muted-foreground tracking-widest uppercase">Join Our Community</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Newsletter */}
            <div className="relative rounded-2xl bg-muted/30 border border-border overflow-hidden p-5 flex-1 flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-wu-red/5 blur-[60px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-wu-red/30 bg-wu-red/5 rounded-full mb-3">
                  <span className="w-1 h-1 rounded-full bg-wu-red animate-pulse" />
                  <span className="font-mono text-[8px] tracking-[0.25em] text-wu-red uppercase">Stay Updated</span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-foreground leading-none tracking-tight mb-2 uppercase">
                  Join The Squad
                </h3>
                <p className="font-body text-muted-foreground text-xs leading-relaxed mb-4">
                  Latest drops, exclusive deals & wrap inspiration.
                </p>
                <div className="flex flex-col gap-3">
                  {subscribed ? (
                    <div className="flex items-center gap-3 bg-wu-red/10 border border-wu-red/30 rounded-xl p-4">
                      <div className="w-8 h-8 rounded-full bg-wu-red flex items-center justify-center shrink-0">
                        <Check size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-foreground text-xs">You&apos;re Subscribed!</p>
                        <p className="font-mono text-[8px] text-muted-foreground tracking-widest uppercase">Watch your inbox.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 min-w-0 bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground font-body text-xs focus:outline-none focus:border-wu-red/40 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        className="group px-4 py-3 bg-wu-red text-white rounded-xl font-display font-bold text-[10px] tracking-widest uppercase hover:bg-wu-red-dark transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <span>Join</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  )}
                  <a
                    href="https://wa.me/916296396462?text=Hi%20WearUp!%20I%27d%20like%20to%20enquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl text-[#25D366] font-display font-bold text-xs tracking-wide hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all group"
                  >
                    <MessageCircle size={15} className="group-hover:scale-110 transition-transform shrink-0" />
                    <span>Drop a message on WhatsApp</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform shrink-0 ml-auto" />
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
