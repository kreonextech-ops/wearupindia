import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { accessoryCategories, Product } from '@/data';
import { getProductsAction } from '@/app/admin/products/actions';
import SafeImage from '@/components/ui/SafeImage';

type Props = { params: { slug: string } };

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80';

export default async function AccessorySubCategoryPage({ params }: Props) {
  const subCat = accessoryCategories.find(c => c.slug === params.slug);
  const subItems = subCat?.items || [];

  // Fetch all bike-accessories products on the SERVER — no spinner, instant render
  const res = await getProductsAction('bike-accessories');
  const allProducts: Product[] = (res.success && res.data) ? res.data as unknown as Product[] : [];

  // For each item, find a matching product
  function findProduct(itemName: string): Product | undefined {
    return allProducts.find(p =>
      p.name.toLowerCase().includes(itemName.toLowerCase()) ||
      itemName.toLowerCase().includes(p.name.toLowerCase()) ||
      (p as any).meta_data?.sub_item === toSlug(itemName)
    );
  }

  return (
    <div className="min-h-screen bg-[#070707]">

      {/* ─── HERO SECTION ─── */}
      <div className="relative min-h-[50vh] sm:min-h-[60vh] flex flex-col bg-[#070707] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={subCat?.image || FALLBACK_IMAGE}
            alt={subCat?.name || ''}
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/80 via-transparent to-[#070707]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20">
          <Link
            href="/shop/bike-accessories"
            className="inline-flex items-center gap-2 text-white/30 hover:text-wu-red transition-colors mb-8 font-mono text-[9px] uppercase tracking-[0.5em]"
          >
            <ArrowLeft size={14} className="opacity-50" /> Back to Accessories
          </Link>
          <h1 className="font-display font-black text-6xl sm:text-[100px] text-white tracking-tighter leading-none uppercase italic mb-8 text-center">
            {subCat?.name || params.slug}
          </h1>
          <p className="font-body text-white/40 max-w-xl mx-auto text-xs sm:text-[14px] tracking-[0.2em] leading-relaxed uppercase text-center">
            {subItems.length} products available in this category
          </p>
        </div>

        {/* ─── WHITE SUB-ITEM STRIP ─── */}
        <div className="relative z-20 bg-white py-3 overflow-x-auto no-scrollbar shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-12 min-w-max">
              {subItems.map((item) => {
                const product = findProduct(item);
                return (
                  <div key={item} className="flex flex-col items-center text-center group">
                    <span className="font-display font-black text-[11px] text-black uppercase tracking-[0.1em] group-hover:text-wu-red transition-colors">
                      {item}
                    </span>
                    <span className={`font-mono text-[8px] uppercase tracking-[0.1em] mt-0.5 ${product ? 'text-wu-red' : 'text-black/30'}`}>
                      {product ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.4em] uppercase text-white/30 mb-16">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>{'>'}</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>{'>'}</span>
          <Link href="/shop/bike-accessories" className="hover:text-white transition-colors">Bike Accessories</Link>
          <span>{'>'}</span>
          <span className="text-white font-bold tracking-[0.4em]">{subCat?.name}</span>
        </div>

        {/* ─── SUB-ITEMS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {subItems.map((item) => {
            const product = findProduct(item);
            const itemSlug = toSlug(item);
            const image = product?.images?.[0] || FALLBACK_IMAGE;
            const href = `/shop/bike-accessories/category/${params.slug}/${itemSlug}`;

            return (
              <Link
                key={item}
                href={href}
                className="group relative flex flex-col bg-[#0A0A0A] border border-white/5 overflow-hidden transition-all duration-500 hover:border-wu-red/30 hover:shadow-[0_20px_50px_rgba(232,22,27,0.1)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <SafeImage
                    src={image}
                    alt={item}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                  {!product && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 border border-white/10 rounded-full">
                      <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest">Coming Soon</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-black text-2xl text-white uppercase tracking-tighter transition-colors duration-300 group-hover:text-wu-red">
                      {item}
                    </h3>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-wu-red group-hover:translate-x-1 transform transition-all" />
                  </div>
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase ${product ? 'text-wu-red' : 'text-white/20'}`}>
                    {product ? 'In Stock — View Product' : 'Coming Soon'}
                  </span>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 border-2 border-wu-red/0 group-hover:border-wu-red/20 transition-all duration-500 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
