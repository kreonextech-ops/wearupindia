'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/assets';
import { Video, Instagram } from 'lucide-react';

// 10 posts for a 5x2 grid
const instagramPosts = [
  { id: '1', href: 'https://www.instagram.com/reel/DVYhT8-iQYf/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==', image: getAssetUrl('/instagram/httpswww.instagram.comreelDVYhT8-iQYfutm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==.jpg') },
  { id: '2', href: 'https://www.instagram.com/reel/DS7f8e2jFkC/?igsh=MWNqYnczOTdsMGFjdA==', image: getAssetUrl('/instagram/httpswww.instagram.comreelDS7f8e2jFkCutm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==.jpg') },
  { id: '3', href: 'https://www.instagram.com/reel/DV74GN0pQ9C/?igsh=MTM1NmRvbDJxamF6Ng==', image: getAssetUrl('/instagram/httpswww.instagram.comreelDV74GN0pQ9Cutm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==.jpg') },
  { id: '4', href: 'https://www.instagram.com/reel/DLFRsWkxyDN/?igsh=bGxzMmNsMTBweGZ5', image: getAssetUrl('/instagram/httpswww.instagram.comreelDLFRsWkxyDNutm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==.jpg') },
  { id: '5', href: 'https://www.instagram.com/reel/DKhOMIQhhO5/?igsh=MW92dHE4eGhsNzlhZw==', image: getAssetUrl('/instagram/httpswww.instagram.comreelDKhOMIQhhO5utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==.jpg') },
];

export default function InstagramReels() {
  return (
    <section className="bg-background pt-16 pb-0 overflow-hidden w-full">
      <ScrollReveal direction="up" className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Instagram className="w-8 h-8 text-foreground" />
          <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground uppercase tracking-tight">
            Follow us on instagram
          </h2>
        </div>
        <p className="text-muted-foreground font-medium">@wearup_ind</p>
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
                alt="Instagram Reel"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              
              {/* Reel Icon (Top Right) - Persistent like the screenshot */}
              <div className="absolute top-3 right-3 z-10 drop-shadow-md">
                <Video className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
