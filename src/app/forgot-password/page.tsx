'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery',
    });
    
    if (error) {
      setError(error.message);
    } else {
      setStep(3);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      setError(error.message);
    } else {
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-40 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-wu-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red transition-colors mb-8 font-mono text-[10px] tracking-widest uppercase">
          <ArrowLeft size={14} /> Return to Login
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image src="/logo.png" alt="WearUp India" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className="font-display font-black text-3xl text-foreground tracking-tight uppercase mb-2">
            System Recovery
          </h1>
          <p className="font-body text-muted-foreground text-sm tracking-wide">
            {step === 1 && "Initiate password reset protocol"}
            {step === 2 && "Enter the 6-digit authorization code"}
            {step === 3 && "Establish new security key"}
            {step === 4 && "Security key updated successfully"}
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl overflow-hidden relative">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-500 text-xs font-mono uppercase tracking-widest">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRequestOTP} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase ml-1">Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@nexus.com"
                      className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all font-body text-sm"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-foreground hover:bg-white text-background font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>Send Authorization Code <ArrowRight size={16} /></>
                  )}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase ml-1">6-Digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all font-mono text-center tracking-[0.5em] text-lg"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">Code sent to {email}</p>
                </div>
                <button 
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-foreground hover:bg-white text-background font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>Verify Code <ArrowRight size={16} /></>
                  )}
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleUpdatePassword} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase ml-1">New Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-wu-red/50 focus:ring-1 focus:ring-wu-red/50 transition-all font-body text-sm"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="w-full bg-wu-red hover:bg-[#B81015] text-white font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(232,22,27,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Update Security Key <ShieldCheck size={16} /></>
                  )}
                </button>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">Password Reset Successful</h3>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  Your new security key is now active. You can use it to log in to your account.
                </p>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center w-full bg-foreground hover:bg-white text-background font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl transition-all"
                >
                  Proceed to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground/60">
          <ShieldCheck size={14} />
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase font-black">Encrypted via Supabase Sentinel</span>
        </div>
      </div>
    </div>
  );
}
