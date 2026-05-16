'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginAction, signInWithGoogle } from '@/app/auth/actions';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push('/');
      router.refresh(); // Update the navbar etc
    } else {
      setError(result.error || 'Authentication Failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-40 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-wu-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          {/* Replaced 'w' with logo.png */}
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
             <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
               <Image src="/logo.png" alt="WearUp India" fill className="object-contain" priority />
             </div>
             {/* Text is hidden when using full logo usually, but we keep it or remove it depending on logo style. We'll leave it as requested, colored correctly */}
             <span className="font-display font-black text-xl tracking-[0.2em] text-foreground">WEARUP</span>
          </Link>
          <h1 className="font-display font-black text-4xl text-foreground tracking-tight uppercase mb-2">Access Granted</h1>
          <p className="font-body text-muted-foreground text-sm tracking-wide">Enter the elite rider headquarters</p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase ml-1">Email Verification</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="name@nexus.com"
                  className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Secret Code</label>
                <Link href="/forgot-password" className="font-mono text-[9px] text-wu-red tracking-widest uppercase hover:underline">Forgot Key?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-wu-red hover:bg-[#B81015] text-white font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(232,22,27,0.2)] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Initiate Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <span className="relative px-4 bg-card text-muted-foreground font-mono text-[9px] tracking-widest uppercase">External Sync</span>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => signInWithGoogle()}
                className="flex items-center justify-center gap-3 w-full bg-background hover:bg-muted border border-border rounded-xl py-4 transition-colors"
              >
                <Chrome size={18} className="text-foreground" />
                <span className="font-body font-bold text-xs text-foreground">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center font-body text-sm text-muted-foreground">
          New Rider? <Link href="/register" className="text-foreground hover:text-wu-red font-bold underline-offset-4 hover:underline transition-colors">Create New Profile (Sign Up)</Link>
        </p>

        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground/60">
          <ShieldCheck size={14} />
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase font-black">Encrypted via Supabase Sentinel</span>
        </div>
      </motion.div>
    </div>
  );
}
