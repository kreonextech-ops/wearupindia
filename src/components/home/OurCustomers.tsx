'use client';

import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';

import { getAssetUrl } from '@/lib/assets';

// Using 9 images total to match the new layout
const galleryImages = [
  getAssetUrl('/gallery/DSC04131.jpg'), // img 1: Top left 1
  getAssetUrl('/gallery/DSC04132.jpg'), // img 2: Top left 2
  getAssetUrl('/gallery/_DSC6811.jpg'), // img 3: Bottom left (Tall)
  
  getAssetUrl('/gallery/DSC07517.jpg'), // img 4: Center top (Tall HERO)
  getAssetUrl('/gallery/_DSC0514.jpg'), // img 5: Center bottom 1
  getAssetUrl('/gallery/DSC07576.jpg'), // img 6: Center bottom 2
  
  getAssetUrl('/gallery/DSC04090.jpg'), // img 7: Top right 1
  getAssetUrl('/gallery/DSC04091.jpg'), // img 8: Top right 2
  getAssetUrl('/gallery/_DSC9835.jpg'), // img 9: Bottom right (Tall)
];

function Cell({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[8px] bg-gray-100 ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="w-full h-full object-cover block hover:scale-[1.03] transition-transform duration-500 ease-out"
      />
    </div>
  );
}

export default function OurCustomers() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 w-full transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal direction="up" className="mb-10">
          <h2 className="font-display font-black text-foreground text-center uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            OUR CUSTOMERS
          </h2>
        </ScrollReveal>

        {/* 
          Grid Layout:
          3 main columns of equal total height.
          
          Left Column: 
          - Top: 2 small images (grid)
          - Bottom: 1 tall image (flex-1)
          
          Center Column:
          - Top: 1 tall hero image (flex-1)
          - Bottom: 2 small images (grid)
          
          Right Column:
          - Top: 2 small images (grid)
          - Bottom: 1 tall image (flex-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full h-auto md:h-[600px] lg:h-[800px]">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 lg:gap-6 h-[500px] md:h-full">
            {/* Top Row: 2 small images */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-[150px] sm:h-[180px] lg:h-[220px] shrink-0">
              <Cell src={galleryImages[0]} alt="Customer 1" />
              <Cell src={galleryImages[1]} alt="Customer 2" />
            </div>
            {/* Bottom Row: 1 tall image */}
            <div className="flex-1 min-h-0">
              <Cell src={galleryImages[2]} alt="Customer 3" className="h-full" />
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="flex flex-col gap-4 lg:gap-6 h-[500px] md:h-full">
             {/* Top Row: 1 tall hero image */}
             <div className="flex-1 min-h-0">
              <Cell src={galleryImages[3]} alt="Customer 4" className="h-full" />
            </div>
            {/* Bottom Row: 2 small images */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-[150px] sm:h-[180px] lg:h-[220px] shrink-0">
              <Cell src={galleryImages[4]} alt="Customer 5" />
              <Cell src={galleryImages[5]} alt="Customer 6" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 lg:gap-6 h-[500px] md:h-full">
            {/* Top Row: 2 small images */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-[150px] sm:h-[180px] lg:h-[220px] shrink-0">
              <Cell src={galleryImages[6]} alt="Customer 7" />
              <Cell src={galleryImages[7]} alt="Customer 8" />
            </div>
            {/* Bottom Row: 1 tall image */}
            <div className="flex-1 min-h-0">
              <Cell src={galleryImages[8]} alt="Customer 9" className="h-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
