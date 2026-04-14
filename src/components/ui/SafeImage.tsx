'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { config } from '@/lib/config';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

/**
 * Resilient Image component that handles:
 * 1. Broken URLs via a branded placeholder.
 * 2. Shimmer loading state.
 * 3. Graceful error logging.
 */
export default function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = config.assets.placeholder, 
  className,
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${props.fill ? 'w-full h-full' : ''}`}>
      {/* Loading Shimmer */}
      {loading && (
        <div className="absolute inset-0 bg-[#111] animate-pulse z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!error) {
            console.warn(`[SafeImage] Failed to load: ${src}. Falling back to placeholder.`);
            setImgSrc(fallbackSrc);
            setError(true);
            setLoading(false);
          }
        }}
      />
      
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
