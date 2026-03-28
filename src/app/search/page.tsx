// src/app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { products } from '@/data';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tighter uppercase mb-2">
            Search Results
          </h1>
          <p className="font-body text-[#888] text-sm sm:text-base mb-12">
            Showing {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for <span className="text-[#E8161B]">"{query}"</span>
          </p>
        </ScrollReveal>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div key={product.id} className="h-[450px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/5 bg-white/2 rounded-2xl">
            <h2 className="font-display font-bold text-2xl text-white mb-4">No gear found</h2>
            <p className="text-[#888] font-body">
              We couldn't find any products matching "{query}". 
              <br />Try using different keywords or browse our shop.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] pt-40 px-8 text-white text-center font-display tracking-widest uppercase">Initializing Radar...</div>}>
      <SearchResults />
    </Suspense>
  );
}
