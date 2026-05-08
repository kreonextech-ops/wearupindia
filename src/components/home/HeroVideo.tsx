'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroVideoProps {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
}

export default function HeroVideo({ src, poster, className = "", priority = false }: HeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoaded = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If video is already loaded (e.g. from cache)
    if (video.readyState >= 3) {
      handleLoaded();
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Static Backdrop Image */}
      <motion.img
        src={poster}
        alt="Hero Backdrop"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }} // Completely hide image once video starts
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoaded}
        onCanPlay={handleLoaded}
        onPlaying={handleLoaded}
        src={src}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out z-10 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Dark Overlay (consistent with original design) */}
      <div className="absolute inset-0 bg-black/20 z-20" />
    </div>
  );
}
