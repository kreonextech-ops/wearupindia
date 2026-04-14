'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[WearUp App Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-20">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-[#E8161B] blur-[100px] opacity-20 rounded-full" />
        <AlertCircle size={80} className="text-[#E8161B] relative z-10" />
      </div>

      <div className="text-center max-w-lg relative z-10">
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.4em] uppercase mb-4">// System Fault</p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-6 uppercase tracking-tighter">
          ENGINE STALLED.
        </h1>
        <p className="font-body text-[#888] mb-12 text-base leading-relaxed">
          Something went wrong with the machine. We&apos;ve logged the fault and our mechanics are on it. Try resetting the engine or head back to base.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-xs tracking-widest uppercase px-10 py-5 hover:bg-[#B81015] transition-all duration-300"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            <RotateCcw size={16} /> Reset Engine
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-3 border border-white/10 bg-white/5 text-white/70 font-display font-bold text-xs tracking-widest uppercase px-10 py-5 hover:border-white/30 hover:text-white transition-all duration-300"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            <Home size={16} /> Go to Home
          </Link>
        </div>
      </div>
      
      {/* Detailed error for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-20 p-6 bg-[#111] border border-white/5 rounded-xl max-w-2xl w-full">
          <p className="font-mono text-[10px] text-[#555] mb-2 uppercase tracking-widest">Debug Info</p>
          <pre className="font-mono text-[11px] text-[#E8161B] whitespace-pre-wrap break-all">
            {error.message}
            {error.digest && `\n\nDigest: ${error.digest}`}
          </pre>
        </div>
      )}
    </div>
  );
}
