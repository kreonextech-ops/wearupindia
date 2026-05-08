'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ui/ScrollReveal';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, price, images, categories(name, slug)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name');
      setResults(data ?? []);
      setLoading(false);
    };

    fetch();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Search Results</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tighter uppercase mb-2">
            {loading ? 'Searching...' : `${results.length} Result${results.length !== 1 ? 's' : ''}`}
          </h1>
          <p className="font-body text-[#888] text-sm sm:text-base mb-12">
            for <span className="text-[#E8161B]">"{query}"</span>
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[350px] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => {
              const catSlug = (product.categories as any)?.slug ?? 'graphic-kits';
              const catName = (product.categories as any)?.name ?? '';
              const img = Array.isArray(product.images) ? product.images[0] : null;
              return (
                <Link
                  key={product.id}
                  href={`/shop/${catSlug}/${product.slug}`}
                  className="group bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#E8161B]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative w-full h-52 bg-[#181818] overflow-hidden">
                    {img ? (
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search size={32} className="text-[#333]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    {catName && (
                      <p className="font-mono text-[9px] text-[#E8161B] uppercase tracking-widest mb-1">{catName}</p>
                    )}
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-[#E8161B] transition-colors leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-display font-black text-lg text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/5 bg-white/[0.02] rounded-2xl">
            <Search size={48} className="text-[#333] mx-auto mb-6" />
            <h2 className="font-display font-bold text-2xl text-white mb-4">No gear found</h2>
            <p className="text-[#888] font-body">
              We couldn't find any products matching "{query}".
              <br />Try using different keywords or browse our shop.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-8 bg-[#E8161B] text-white font-display font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#B81015] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] pt-40 px-8 text-white text-center font-display tracking-widest uppercase">
        Searching...
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
