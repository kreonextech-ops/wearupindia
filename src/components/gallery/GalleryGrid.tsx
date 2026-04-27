'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetUrl } from '@/lib/assets';

interface GalleryGridProps {
  files: string[];
}

export default function GalleryGrid({ files }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const showPrev = () => {
    setSelectedIndex((prev) => (prev === null || prev === 0 ? files.length - 1 : prev - 1));
  };

  const showNext = () => {
    setSelectedIndex((prev) => (prev === null || prev === files.length - 1 ? 0 : prev + 1));
  };

  const getSpan = (index: number) => {
    const mod = index % 10;
    switch (mod) {
      case 0: return 'md:col-span-2 md:row-span-2';
      case 5: return 'md:col-span-2';
      case 8: return 'md:col-span-3';
      default: return '';
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[250px] gap-3">
          {files.map((file, i) => {
            const isVideo = file.toLowerCase().endsWith('.mp4');
            const span = getSpan(i);
            // Encode filename to handle spaces and special characters in filenames
            const src = getAssetUrl(`/gallery/${encodeURIComponent(file)}`);

            return (
              <div
                key={file + i}
                onClick={() => setSelectedIndex(i)}
                className={`relative group overflow-hidden bg-[#1a1a1a] rounded-xl border border-white/5 cursor-pointer ${span}`}
              >
                {isVideo ? (
                  <video 
                    autoPlay muted loop playsInline 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  >
                    <source src={src} type="video/mp4" />
                  </video>
                ) : (
                  // Use native img to bypass Next.js optimization pipeline which times out on 157 images
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`WearUp Gallery Project ${i}`}
                    loading={i < 12 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                )}
                
                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-mono text-[10px] font-bold text-white tracking-[0.3em] uppercase bg-[#E8161B] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(232,22,27,0.4)] border border-[#E8161B]/50 transition-transform group-hover:scale-110">
                    {isVideo ? 'Play Video' : 'View Full'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {files.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-white font-display text-2xl">Loading Gallery...</h3>
            <p className="text-[#666] font-body mt-2">Uploading high-octane shots.</p>
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setSelectedIndex(null)} // Click outside to close
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-white/10 hover:bg-[#E8161B] hover:scale-110 rounded-full text-white transition-all duration-300 z-[60]"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-2 sm:left-8 p-3 bg-black/50 hover:bg-[#E8161B] hover:scale-110 rounded-full text-white transition-all duration-300 z-[60] border border-white/10"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-2 sm:right-8 p-3 bg-black/50 hover:bg-[#E8161B] hover:scale-110 rounded-full text-white transition-all duration-300 z-[60] border border-white/10"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>

          {/* Media Container */}
          <div 
            className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {files[selectedIndex].toLowerCase().endsWith('.mp4') ? (
              <video 
                key={selectedIndex}
                autoPlay controls playsInline 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
              >
                <source src={getAssetUrl(`/gallery/${encodeURIComponent(files[selectedIndex])}`)} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={selectedIndex}
                src={getAssetUrl(`/gallery/${encodeURIComponent(files[selectedIndex])}`)}
                alt="WearUp Gallery Full View"
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
              />
            )}
            
            {/* Counter */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#888] tracking-widest uppercase">
              {selectedIndex + 1} / {files.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
