import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, Clock, ArrowRight } from 'lucide-react';
import { services } from '@/data';

type Props = { params: { service: string } };

export async function generateStaticParams() {
  return services.map(s => ({ service: s.slug }));
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find(s => s.slug === params.service);
  if (!service) notFound();

  const others = services.filter(s => s.slug !== params.service);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={service.image} alt={service.name} fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/60 to-[#0A0A0A]" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link href="/services" className="flex items-center gap-2 text-[#666] hover:text-white text-xs font-mono tracking-widest uppercase mb-6 transition-colors w-fit">
            <ArrowLeft size={12} /> All Services
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">{service.tagline}</p>
              <h1 className="font-display font-black text-5xl sm:text-7xl text-white leading-none">{service.name.toUpperCase()}</h1>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase">Starting From</p>
                <p className="font-display font-black text-3xl text-[#E8161B]">{service.price}</p>
              </div>
              <div className="w-px h-12 bg-[#2a2a2a]" />
              <div>
                <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-[#888]" />
                  <p className="font-display font-bold text-lg text-white">{service.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="font-display font-black text-2xl text-white mb-4 red-line">ABOUT THIS SERVICE</h2>
              <p className="font-body text-[#777] leading-relaxed">{service.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-display font-black text-2xl text-white mb-6 red-line">WHAT&apos;S INCLUDED</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3 p-4 bg-[#111] border border-[#1a1a1a]">
                    <div className="w-5 h-5 bg-[#E8161B]/10 border border-[#E8161B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-[#E8161B]" />
                    </div>
                    <span className="font-body text-[#888] text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="font-display font-black text-2xl text-white mb-8 red-line">OUR PROCESS</h2>
              <div className="space-y-0">
                {service.process.map((step, i) => (
                  <div key={step.step} className="flex gap-6 relative">
                    {/* Line */}
                    {i < service.process.length - 1 && (
                      <div className="absolute left-[19px] top-12 bottom-0 w-px bg-[#1a1a1a]" />
                    )}
                    {/* Step number */}
                    <div className="flex-shrink-0 w-10 h-10 bg-[#E8161B] flex items-center justify-center font-mono text-xs font-bold text-white z-10">
                      {step.step}
                    </div>
                    <div className="pb-10">
                      <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                      <p className="font-body text-[#666] text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="relative">
            <div className="sticky top-28 space-y-6">
              {/* Booking Card */}
              <div className="bg-[#111] border border-[#1a1a1a] p-6 shadow-2xl">
              <h3 className="font-display font-black text-xl text-white mb-2">READY TO BOOK?</h3>
              <p className="font-body text-[#666] text-sm mb-6">Get in touch and we&apos;ll sort the rest. Response within 2 hours.</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm border-b border-[#1a1a1a] pb-3">
                  <span className="font-mono text-[#555] uppercase text-xs tracking-wider">Service</span>
                  <span className="font-display font-bold text-white">{service.name}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-[#1a1a1a] pb-3">
                  <span className="font-mono text-[#555] uppercase text-xs tracking-wider">Starting</span>
                  <span className="font-display font-bold text-[#E8161B]">{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-[#555] uppercase text-xs tracking-wider">Duration</span>
                  <span className="font-display font-bold text-white">{service.duration}</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase py-4 hover:bg-[#B81015] transition-colors"
              >
                Book This Service <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/919876543210"
                className="w-full flex items-center justify-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase py-4 hover:text-white hover:border-[#444] transition-colors mt-3"
              >
                WhatsApp Us
              </a>
            </div>

            {/* Other services */}
            <div>
              <h3 className="font-mono text-[10px] text-[#555] tracking-[0.3em] uppercase mb-4">Other Services</h3>
              <div className="space-y-2">
                {others.map(s => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between p-4 bg-[#111] border border-[#1a1a1a] hover:border-[#E8161B]/40 transition-all group"
                  >
                    <div>
                      <p className="font-display font-bold text-sm text-white group-hover:text-[#E8161B] transition-colors">{s.name}</p>
                      <p className="font-mono text-[10px] text-[#555]">{s.price}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#333] group-hover:text-[#E8161B] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
