'use client';

import { useState, useRef, useEffect } from 'react';

interface SequentialVideoPlayerProps {
  sources: string[];
  className?: string;
  poster?: string;
}

export default function SequentialVideoPlayer({ sources, className = "", poster }: SequentialVideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && sources.length > 0) {
      videoRef.current.src = sources[currentIndex];
      videoRef.current.play().catch(() => {
        // Autoplay policy might block it, silently fail
      });
    }
  }, [currentIndex, sources]);

  if (!sources || sources.length === 0) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={currentIndex === 0 ? poster : undefined}
      onEnded={() => setCurrentIndex((prev) => (prev + 1) % sources.length)}
      className={className}
    />
  );
}
