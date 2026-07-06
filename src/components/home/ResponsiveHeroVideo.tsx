'use client';

import { useState, useEffect } from 'react';
import SequentialVideoPlayer from '@/components/ui/SequentialVideoPlayer';
import HeroVideo from './HeroVideo';

interface ResponsiveHeroVideoProps {
  sources: string[];
  singleSource: string;
  poster: string;
}

export default function ResponsiveHeroVideo({ sources, singleSource, poster }: ResponsiveHeroVideoProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial screen size
    const checkIsMobile = () => window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(checkIsMobile());

    // Optional: listener if we want to handle resize (not strictly necessary but good practice)
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Hydration safety: render nothing or a poster fallback until client decides
  if (isMobile === null) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* We can just show the poster image here or let it be blank for a split second */}
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="absolute inset-0">
          <SequentialVideoPlayer 
            sources={sources}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      ) : (
        <HeroVideo 
          src={singleSource}
          poster={poster}
          className="absolute inset-0 w-full h-full"
        />
      )}
    </>
  );
}
