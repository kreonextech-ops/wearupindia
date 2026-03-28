import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const team = [
  { name: 'Arjun Mehta', role: 'Founder & Head Wrapper', city: 'Bengaluru' },
  { name: 'Priya Singh', role: 'Design Lead', city: 'Delhi' },
  { name: 'Rohan Verma', role: 'Head of Detailing', city: 'Mumbai' },
  { name: 'Aisha Khan', role: 'Customer Experience', city: 'Hyderabad' },
];

const values = [
  { title: 'Precision First', desc: 'Every millimetre of vinyl we lay is measured, heated, and sealed with obsessive care. No shortcuts, ever.' },
  { title: 'India-Proof', desc: 'Monsoon, heat, highway dust — our materials are tested for the unique punishment of Indian roads.' },
  { title: 'Rider-Centric', desc: 'We ride too. We\'re not just a vendor — we understand what your machine means to you.' },
  { title: 'Transparency', desc: 'Fixed pricing, clear timelines, honest communication. You always know exactly what you\'re getting.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1600&q=80"
          alt="WearUp Workshop"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4">// Our Story</p>
          <h1 className="font-display font-black leading-none mb-6">
            <span className="block text-[clamp(3rem,8vw,6rem)] text-white">BUILT FOR</span>
            <span className="block text-[clamp(3rem,8vw,6rem)] text-[#E8161B] italic">THE BOLD.</span>
          </h1>
          <p className="font-body text-[#777] max-w-xl text-base leading-relaxed">
            WearUp was born from a simple frustration: finding premium bike aesthetics in India was near impossible. We changed that.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-4">// The Beginning</p>
            <h2 className="font-display font-black text-4xl text-white mb-6">FROM GARAGE TO INDIA&apos;S PRECISION WORKSHOP</h2>
            <div className="space-y-4 font-body text-[#777] text-sm leading-relaxed">
              <p>
                It started in a garage in Bengaluru in 2019. Our founder Arjun had spent years watching international riders show off stunning custom wraps with zero equivalent available in India. So he trained under European wrap specialists, imported his first roll of 3M film, and started wrapping bikes for friends.
              </p>
              <p>
                Word spread fast. Within a year, WearUp had a dedicated workshop, a full team, and a waiting list. Today we serve riders across India — from Royal Enfield enthusiasts in Chennai to sport bike riders in Delhi — with the same obsessive attention to detail that started it all.
              </p>
              <p>
                We&apos;re not just a shop. We&apos;re a community of riders who believe your machine is an extension of your identity. Every wrap, every decal, every accessory we sell is chosen with that philosophy in mind.
              </p>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="WearUp Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-[#E8161B] px-4 py-3">
              <p className="font-display font-black text-2xl text-white">2019</p>
              <p className="font-mono text-[10px] text-white/70 tracking-widest">FOUNDED IN BENGALURU</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0d0d0d] border-y border-[#1a1a1a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// What We Stand For</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">OUR VALUES</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="p-8 bg-[#111] border border-[#1a1a1a] hover:border-[#E8161B]/30 transition-all">
                <div className="font-mono text-[#E8161B]/30 text-4xl font-bold mb-4">0{i + 1}</div>
                <h3 className="font-display font-black text-xl text-white mb-3">{v.title}</h3>
                <p className="font-body text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// The Team</p>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white">THE CREW</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map(member => (
            <div key={member.name} className="group">
              <div className="relative aspect-square bg-[#181818] border border-[#1a1a1a] overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8161B]/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-black text-6xl text-[#2a2a2a]">{member.name[0]}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-base text-white">{member.name}</h3>
              <p className="font-mono text-[10px] text-[#E8161B] tracking-widest uppercase mb-0.5">{member.role}</p>
              <p className="font-mono text-[10px] text-[#444]">{member.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8161B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-black text-4xl text-white">READY TO RIDE BOLDER?</h2>
            <p className="font-body text-white/70 mt-1 text-sm">Get your bike transformed at India&apos;s most precise workshop.</p>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-3 bg-white text-[#E8161B] font-display font-black text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#f0f0f0] transition-colors whitespace-nowrap"
          >
            Contact Us <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
