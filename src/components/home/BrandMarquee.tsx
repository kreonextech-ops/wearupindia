'use client';

import { motion } from 'framer-motion';
import { brandMarquee } from '@/data';

export default function BrandMarquee() {
  // Triple the marquee items to ensure seamless infinite scroll
  const items = [...brandMarquee, ...brandMarquee, ...brandMarquee];

  return (
    <div className="bg-[#050505] border-y border-white/5 py-4 overflow-hidden select-none">
      <div className="relative flex">
        <motion.div
          animate={{
            x: [0, -1035], // Approximate width of one set of items
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex flex-nowrap gap-12 sm:gap-20 items-center justify-center min-w-full"
        >
          {items.map((brand, idx) => (
            <div 
              key={`${brand}-${idx}`} 
              className="group flex items-center gap-4 flex-shrink-0"
            >
              <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tighter text-white/20 group-hover:text-wu-red transition-all duration-500 uppercase italic">
                {brand}
              </span>
              <div className="w-2 h-2 rounded-full bg-wu-red opacity-30 group-hover:scale-150 transition-transform duration-500" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
