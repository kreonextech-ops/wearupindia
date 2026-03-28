import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display font-black text-[10rem] sm:text-[14rem] leading-none text-[#1a1a1a] select-none">
          404
        </p>
        <div className="-mt-8 sm:-mt-12 relative z-10">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Off Track</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">
            WRONG TURN, RIDER.
          </h1>
          <p className="font-body text-[#555] mb-8 text-sm max-w-sm mx-auto">
            This page doesn&apos;t exist. Head back and find what you&apos;re really looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors"
            >
              Back to Home <ArrowRight size={14} />
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:text-white hover:border-[#444] transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
