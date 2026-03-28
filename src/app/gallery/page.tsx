import Image from 'next/image';

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tag: 'Bike Wrap', span: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80', tag: 'Custom Decals', span: '' },
  { src: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80', tag: 'Accessories', span: '' },
  { src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', tag: 'Merchandise', span: '' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', tag: 'Detail Wash', span: '' },
  { src: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80', tag: 'Stickers', span: 'col-span-2' },
  { src: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80', tag: 'Helmets', span: '' },
  { src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', tag: 'Apparel', span: '' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', tag: 'Wrap', span: '' },
  { src: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80', tag: 'Decals', span: '' },
  { src: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80', tag: 'Gear', span: '' },
  { src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', tag: 'Merch', span: '' },
];

const filters = ['All', 'Wraps', 'Decals', 'Accessories', 'Merch', 'Services'];

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Our Portfolio</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-white leading-none">
            THE KINETIC<br /><span className="text-[#E8161B]">GALLERY</span>
          </h1>
          <p className="font-body text-[#666] mt-4 text-sm max-w-xl">
            1,500+ wraps completed. Every machine we touch leaves sharper than it arrived.
          </p>
        </div>
      </div>

      {/* Filters (static, JS filter can be added) */}
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`font-display font-bold text-xs tracking-widest uppercase px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  i === 0
                    ? 'border-[#E8161B] text-white'
                    : 'border-transparent text-[#555] hover:text-white hover:border-[#333]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[200px] gap-3">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`relative group overflow-hidden img-zoom ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.tag}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-[11px] font-bold text-white tracking-[0.3em] uppercase bg-[#E8161B] px-3 py-1">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-[#1a1a1a] bg-[#0d0d0d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '1,500+', label: 'Wraps Completed' },
              { num: '800+', label: 'Happy Riders' },
              { num: '4.9★', label: 'Average Rating' },
              { num: '5+', label: 'Years Experience' },
            ].map(stat => (
              <div key={stat.num}>
                <div className="font-display font-black text-4xl text-[#E8161B] mb-1">{stat.num}</div>
                <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
