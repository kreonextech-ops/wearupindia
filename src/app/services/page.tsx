import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Check } from 'lucide-react';
import { services } from '@/data';

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="relative bg-[#111] border-b border-[#1a1a1a] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E8161B 0, #E8161B 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Core Systems</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-white leading-none">
            PROFESSIONAL<br /><span className="text-[#E8161B]">PIT STOP</span>
          </h1>
          <p className="font-body text-[#666] mt-6 text-base max-w-xl leading-relaxed">
            We don&apos;t just fix bikes — we refine them. Our detailing and wrapping services are the industry benchmark across India.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {services.map((service, i) => (
          <div key={service.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a] overflow-hidden group ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
            {/* Image */}
            <div className={`relative h-64 lg:h-auto img-zoom ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <Image src={service.image} alt={service.name} fill className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 to-transparent" />
            </div>

            {/* Content */}
            <div className={`p-10 bg-[#111] flex flex-col justify-center ${i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-2">{service.price}</p>
                  <h2 className="font-display font-black text-4xl text-white">{service.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-[#555] font-mono text-xs">
                  <Clock size={12} />
                  <span>{service.duration}</span>
                </div>
              </div>

              <p className="font-body text-[#777] text-sm leading-relaxed mb-6">{service.description}</p>

              <ul className="grid grid-cols-2 gap-2 mb-8">
                {service.features.slice(0, 4).map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={12} className="text-[#E8161B] mt-1 flex-shrink-0" />
                    <span className="font-body text-[#666] text-xs">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#B81015] transition-colors"
                >
                  View Details <ArrowRight size={13} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-xs tracking-widest uppercase px-6 py-3 hover:text-white hover:border-[#444] transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
