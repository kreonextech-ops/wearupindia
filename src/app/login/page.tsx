'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login for now
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E8161B]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.02] blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="w-10 h-10 rounded-full bg-[#E8161B] flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(232,22,27,0.4)]">
              <span className="text-white font-display font-black text-sm leading-none">W</span>
            </div>
            <span className="font-display font-black text-xl tracking-[0.2em] text-white">WEARUP</span>
          </Link>
          <h1 className="font-display font-black text-4xl text-white tracking-tight uppercase mb-2">Access Granted</h1>
          <p className="font-body text-[#666] text-sm tracking-wide">Enter the elite rider headquarters</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase ml-1">Email Verification</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@nexus.com"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-[#E8161B]/50 focus:bg-black/60 transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Secret Code</label>
                <Link href="#" className="font-mono text-[9px] text-[#E8161B] tracking-widest uppercase hover:underline">Forgot Key?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-[#E8161B]/50 focus:bg-black/60 transition-all font-body text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8161B] hover:bg-[#B81015] text-white font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(232,22,27,0.2)] flex items-center justify-center gap-3 group"
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
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 bg-transparent text-white/20 font-mono text-[9px] tracking-widest uppercase">External Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-4 transition-colors">
                <Chrome size={18} className="text-white" />
                <span className="font-body font-bold text-xs text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-4 transition-colors">
                <Github size={18} className="text-white" />
                <span className="font-body font-bold text-xs text-white">Github</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center font-body text-sm text-[#555]">
          New to the hub? <Link href="/register" className="text-white hover:text-[#E8161B] underline-offset-4 hover:underline transition-colors">Recruit Membership</Link>
        </p>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#222]">
          <ShieldCheck size={14} />
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase font-black">Encrypted via Supabase Sentinel</span>
        </div>
      </motion.div>
    </div>
  );
}
