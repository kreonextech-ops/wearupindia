'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';

import { getAssetUrl } from '@/lib/assets';

// 10 posts for a 5x2 grid
const instagramPosts = [
  { id: '1', href: 'https://www.instagram.com/wearup_ind/', image: getAssetUrl('/gallery/DSC00064.jpg') },
  { id: '2', href: 'https://www.instagram.com/wearup_ind/', image: getAssetUrl('/gallery/DSC00070.jpg') },
  { id: '3', href: 'https://www.instagram.com/wearup_ind/', image: getAssetUrl('/gallery/DSC00071.jpg') },
  { id: '4', href: 'https://www.instagram.com/wearup_ind/', image: getAssetUrl('/gallery/DSC00088.jpg') },
  { id: '5', href: 'https://www.instagram.com/wearup_ind/', image: getAssetUrl('/gallery/DSC00250.jpg') },
];

export default function InstagramReels() {
  return (
    <section className="bg-background pt-16 pb-0 overflow-hidden w-full">
      <ScrollReveal direction="up" className="mb-10 text-center">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground uppercase tracking-tight">
          Follow us on instagram : WEARUP_IND
        </h2>
      </ScrollReveal>

      {/* Edge-to-edge seamless grid */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0">
          {instagramPosts.map((post) => (
            <Link 
              key={post.id} 
              href={post.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative w-full aspect-square overflow-hidden bg-muted block"
            >
              <Image
                src={post.image}
                alt="Instagram Post"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                {/* Optional icon on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
