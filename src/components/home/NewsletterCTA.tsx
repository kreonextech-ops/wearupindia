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
    <section className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="relative rounded-3xl bg-[#111] border border-white/8 overflow-hidden">
            {/* Background noise/glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8161B]/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#E8161B]/6 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />

            <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-12">
              {/* Copy */}
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E8161B]/30 bg-[#E8161B]/5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8161B] animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#E8161B] uppercase">
                    Early Drop Alerts
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-none tracking-tight mb-4">
                  JOIN 2,400+<br />RIDERS.
                </h2>
                <p className="font-body text-white/35 text-sm leading-relaxed">
                  Get first access to new wrap packs, limited gear drops, and exclusive deals before they go live. Pure signal. No spam.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[320px]">
                {subscribed ? (
                  <div className="flex items-center gap-4 bg-[#E8161B]/10 border border-[#E8161B]/30 rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-full bg-[#E8161B] flex items-center justify-center shrink-0">
                      <Check size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-white text-sm">You're in the fleet.</p>
                      <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">Stand by for the next drop.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/15 font-body text-sm focus:outline-none focus:border-[#E8161B]/40 transition-all"
                    />
                    <button
                      type="submit"
                      className="group px-5 py-4 bg-[#E8161B] text-white rounded-2xl font-display font-bold text-xs tracking-widest uppercase hover:bg-[#cc1318] transition-colors flex items-center gap-2 shrink-0"
                    >
                      <span>GO</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                )}

                <a
                  href="https://wa.me/919999999999?text=Hey! I'm interested in WearUp products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 border border-white/8 bg-white/[0.02] rounded-2xl px-6 py-4 text-white/40 hover:text-white hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300"
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
