'use client';

import { MapPin, Phone, Clock, MessageCircle, ArrowRight, Navigation } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

const businessHours = [
  { day: 'Monday', hours: '10:00 AM – 8:30 PM', open: true },
  { day: 'Tuesday', hours: '10:00 AM – 8:30 PM', open: true },
  { day: 'Wednesday', hours: 'Closed', open: false },
  { day: 'Thursday', hours: '10:00 AM – 8:30 PM', open: true },
  { day: 'Friday', hours: '10:00 AM – 8:30 PM', open: true },
  { day: 'Saturday', hours: '10:00 AM – 8:30 PM', open: true },
  { day: 'Sunday', hours: '10:00 AM – 8:30 PM', open: true },
];

function getTodayStatus() {
  const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const reordered = [
    businessHours[6], // Sunday
    businessHours[0], // Monday
    businessHours[1],
    businessHours[2],
    businessHours[3],
    businessHours[4],
    businessHours[5],
  ];
  return reordered[dayIndex];
}

export default function ContactSection() {
  const today = getTodayStatus();

  return (
    <section className="border-t border-border bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <ScrollReveal direction="up" className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-wu-red" /> Find Us
              </p>
              <h2 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tight leading-none uppercase">
                Visit The<br /><span className="text-wu-red">Studio</span>
              </h2>
            </div>
            <p className="font-body text-muted-foreground text-sm max-w-sm leading-relaxed">
              Drop by our studio in Siliguri for consultations, custom wrap fittings, and professional installations.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* MAP - takes 3 columns */}
          <ScrollReveal direction="up" className="lg:col-span-3 rounded-2xl overflow-hidden border border-border relative group" style={{ minHeight: '480px' }}>
            {/* Google Maps Embed */}
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

            {/* Directions Overlay Button */}
            <div className="absolute bottom-4 left-4 z-10">
              <a
                href="https://maps.google.com/?q=Wearup+India+Siliguri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-wu-red text-white font-display font-bold text-[10px] tracking-widest uppercase shadow-lg hover:scale-105 transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                <Navigation size={12} />
                Get Directions
              </a>
            </div>
          </ScrollReveal>

          {/* Info Panel - takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Address Card */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="p-6 bg-muted/50 border border-border rounded-2xl group hover:border-wu-red/30 transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wu-red/10 border border-wu-red/20 flex items-center justify-center shrink-0 group-hover:bg-wu-red/20 transition-colors">
                    <MapPin size={18} className="text-wu-red" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-wu-red tracking-[0.3em] uppercase mb-2">Address</p>
                    <p className="font-display font-bold text-foreground text-sm leading-relaxed">
                      Medical More, Shibmandir<br />
                      Opp. of Mukta Nursing Home<br />
                      Sarada Pally, Siliguri<br />
                      West Bengal – 734011
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Phone Card */}
            <ScrollReveal direction="up" delay={0.15}>
              <a
                href="tel:+916296396462"
                className="block p-6 bg-muted/50 border border-border rounded-2xl group hover:border-wu-red/30 transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wu-red/10 border border-wu-red/20 flex items-center justify-center shrink-0 group-hover:bg-wu-red/20 transition-colors">
                    <Phone size={18} className="text-wu-red" />
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[9px] text-wu-red tracking-[0.3em] uppercase mb-1">Call Us</p>
                    <p className="font-display font-bold text-foreground text-lg tracking-wide">+91 62963 96462</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-wu-red group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            </ScrollReveal>

            {/* Hours Card */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-6 bg-muted/50 border border-border rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-wu-red/10 border border-wu-red/20 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-wu-red" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className="font-mono text-[9px] text-wu-red tracking-[0.3em] uppercase">Business Hours</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-display font-bold tracking-wider uppercase ${today.open ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {today.open ? 'Open Today' : 'Closed Today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {businessHours.map((item) => (
                    <div key={item.day} className="flex justify-between items-center">
                      <span className="font-body text-xs text-muted-foreground">{item.day}</span>
                      <span className={`font-mono text-[10px] font-semibold ${!item.open ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* WhatsApp CTA */}
            <ScrollReveal direction="up" delay={0.25}>
              <a
                href="https://wa.me/916296396462?text=Hi%20WearUp!%20I%27d%20like%20to%20enquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl text-[#25D366] font-display font-bold text-sm tracking-wide hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-300 group"
              >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                Chat on WhatsApp
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  );
}
