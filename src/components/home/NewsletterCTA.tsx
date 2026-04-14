'use client';

import { useState } from 'react';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function NewsletterCTA() {
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
    <section className="py-16 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="relative rounded-3xl bg-card border border-border overflow-hidden">
            {/* Background noise/glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-wu-red/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-wu-red/5 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />

            <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-12">
              {/* Copy */}
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-wu-red/30 bg-wu-red/5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-wu-red animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-wu-red uppercase">
                    Stay Updated
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground leading-none tracking-tight mb-4">
                  JOIN OUR<br />COMMUNITY.
                </h2>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  Get the latest updates on new wrap designs, accessories, and exclusive deals. No spam.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[320px]">
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
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-background border border-border rounded-2xl px-5 py-4 text-foreground placeholder-muted-foreground font-body text-sm focus:outline-none focus:border-wu-red/40 transition-all"
                    />
                    <button
                      type="submit"
                      className="group px-5 py-4 bg-wu-red text-white rounded-2xl font-display font-bold text-xs tracking-widest uppercase hover:bg-wu-red-dark transition-colors flex items-center gap-2 shrink-0"
                    >
                      <span>SUBSCRIBE</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                )}

                <a
                  href="https://wa.me/919999999999?text=Hey! I'm interested in WearUp products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 border border-border bg-background/50 rounded-2xl px-6 py-4 text-muted-foreground hover:text-foreground hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300"
                >
                  <MessageCircle size={17} className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="font-display font-bold text-xs tracking-[0.15em] uppercase">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
