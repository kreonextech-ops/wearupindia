import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAssetUrl } from '@/lib/assets';

const team = [
  { name: 'Arjun Mehta', role: 'Founder & Head Wrapper', city: 'Siliguri' },
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
          <p className="font-body text-zinc-200 max-w-2xl text-base leading-relaxed text-justify">
            Wearup is a performance driven motorcycle and car graphics and paint protection film (PPF) company built on one clear vision to redefine automotive styling and protection.
          </p>
        </div>
        {/* Red separator line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-[#E8161B]/40 z-20" />
      </div>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-black text-4xl mb-6 uppercase tracking-tight text-white">
              Redefining automotive <span className="text-[#E8161B]">style and protection</span>
            </h2>
            <div className="space-y-6 font-body text-zinc-200 text-sm sm:text-base leading-relaxed text-justify">
              <p>
                We believe every machine tells a story, and our mission is to enhance that story through precision design, cutting-edge materials, and flawless execution.
              </p>
              <p>
                Specializing in custom graphics, wraps, and advanced PPF solutions, Wearup blends creativity with technology to deliver results that don’t just look exceptional but also stand the test of time. Whether it’s a daily driven car or a passion-built motorcycle, we approach every project with the same attention to detail, ensuring a perfect balance of style, durability, and protection.
              </p>
              <p>
                At Wearup, we don’t follow trends we set them. Our focus is on innovation, quality craftsmanship, and pushing boundaries to create finishes that turn heads while protecting what matters underneath. From bold transformations to subtle enhancements, we work closely with our clients to bring their vision to life.
              </p>
              <p>
                Driven by passion and fueled by precision, Wearup is more than just a service it’s a commitment to excellence, individuality, and redefining the standard of automotive aesthetics.
              </p>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden">
            <Image
              src={getAssetUrl('/gallery/IMG_5273.PNG')}
              alt="WearUp Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-[#E8161B] px-4 py-3">
              <p className="font-display font-black text-2xl text-white">2020</p>
              <p className="font-mono text-[10px] text-white/70 tracking-widest">FOUNDED IN SILIGURI</p>
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
