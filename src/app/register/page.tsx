'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration for now
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#E8161B]/5 blur-[150px] rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-white/[0.01] blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="w-10 h-10 rounded-full bg-[#E8161B] flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(232,22,27,0.4)]">
              <span className="text-white font-display font-black text-sm leading-none">W</span>
            </div>
            <span className="font-display font-black text-xl tracking-[0.2em] text-white">WEARUP</span>
          </Link>
          <h1 className="font-display font-black text-4xl text-white tracking-tight uppercase mb-2">New Recruit</h1>
          <p className="font-body text-[#666] text-sm tracking-wide">Join the vanguard of motorcycle aesthetics</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Rider Name"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-[#E8161B]/50 focus:bg-black/60 transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase ml-1">Email Terminal</label>
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
              <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase ml-1">Encryption Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="Set Password"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-[#E8161B]/50 focus:bg-black/60 transition-all font-body text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-[#E8161B] hover:text-white font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Establish Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center font-body text-sm text-[#555]">
          Existing member? <Link href="/login" className="text-white hover:text-[#E8161B] underline-offset-4 hover:underline transition-colors">Access Headquarters</Link>
        </p>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#222]">
          <ShieldCheck size={14} />
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase font-black">Secure Onboarding Pipeline</span>
        </div>
      </motion.div>
    </div>
  );
}
