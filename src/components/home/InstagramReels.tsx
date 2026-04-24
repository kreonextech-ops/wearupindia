'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import SafeImage from '@/components/ui/SafeImage';
import { Video, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Static representations of Reels/Posts
const instagramPosts = [
  { id: '1', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/DSC00064.jpg', isVideo: true },
  { id: '2', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/_DSC0514.jpg', isVideo: true },
  { id: '3', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/_DSC6811.jpg', isVideo: true },
  { id: '4', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/DSC_9869.jpg', isVideo: true },
  { id: '5', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/_DSC9835.jpg', isVideo: false },
  { id: '6', href: 'https://www.instagram.com/wearup_ind/', image: '/gallery/DSC07517.jpg', isVideo: true },
];

export default function InstagramReels() {
  return (
    <section className="py-24 border-t border-border bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="font-mono text-[11px] text-wu-red tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-wu-red" /> @wearup_ind
            </p>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-foreground uppercase tracking-tighter italic leading-none">
              Watch Us<br />Work
            </h2>
          </div>
          <Link
            href="https://www.instagram.com/wearup_ind"
            target="_blank"
            className="hidden md:flex items-center gap-2 group text-muted-foreground hover:text-wu-red transition-colors"
          >
            <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] tracking-widest uppercase">Follow on Instagram</span>
          </Link>
        </ScrollReveal>

        {/* Static Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {instagramPosts.map((post, i) => (
            <ScrollReveal key={post.id} direction="up" delay={i * 0.1} className="w-full">
              <Link href={post.href} target="_blank" rel="noopener noreferrer" className="block group relative w-full aspect-square overflow-hidden bg-muted">
                
                <SafeImage
                  src={post.image}
                  alt="Instagram Post Thumbnail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 z-10" />

                {/* Video/Reel Icon Indicator */}
                {post.isVideo && (
                  <div className="absolute top-3 right-3 z-20 text-white drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                    <Video size={20} strokeWidth={1.5} />
                  </div>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={0.4} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="https://www.instagram.com/wearup_ind"
            target="_blank"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-wu-red text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(232,22,27,0.25)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
          >
            <Instagram size={14} />
            Follow Our Work <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
            New content every day
          </span>
        </ScrollReveal>

      </div>
    </section>
  );
}
