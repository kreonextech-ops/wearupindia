'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare, User, Mail, Tag, Loader2 } from 'lucide-react';
import { submitFormAction } from '@/lib/actions/forms';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
}

export default function BulkOrderModal({ isOpen, onClose, categoryName }: BulkOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quantity: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const res = await submitFormAction({
      name: formData.name,
      email: formData.email,
      message: `Quantity: ${formData.quantity}\nRequirements: ${formData.requirements}`,
      type: 'bulk_order',
      metadata: { category: categoryName, quantity: formData.quantity }
    });
    
    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      // Auto close after showing success for a bit
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', quantity: '', requirements: '' });
      }, 5000);
    } else {
      setError(res.error || 'Failed to send inquiry. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative h-32 bg-wu-red flex items-center px-8">
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-0 right-0 text-9xl font-display font-black text-white translate-x-12 -translate-y-12 select-none">
                  BULK
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-display font-black text-3xl uppercase tracking-tighter">Bulk Order</h3>
                <p className="text-white/80 font-mono text-[10px] uppercase tracking-widest">Inquiry for {categoryName}</p>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        required
                        type="text"
                        placeholder="Your Full Name"
                        className="w-full bg-muted/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-wu-red/20 focus:border-wu-red transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-muted/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-wu-red/20 focus:border-wu-red transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Quantity */}
                      <div className="relative col-span-2 sm:col-span-1">
                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          required
                          type="number"
                          placeholder="Est. Quantity"
                          className="w-full bg-muted/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-wu-red/20 focus:border-wu-red transition-all"
                          value={formData.quantity}
                          onChange={e => setFormData({...formData, quantity: e.target.value})}
                        />
                      </div>
                      <div className="hidden sm:flex items-center text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-tight">
                        Minimum order quantity applies
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-4 top-4 text-muted-foreground" />
                      <textarea
                        required
                        placeholder="Requirement Details (Colors, Sizes, Custom Logos...)"
                        rows={4}
                        className="w-full bg-muted/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-wu-red/20 focus:border-wu-red transition-all resize-none"
                        value={formData.requirements}
                        onChange={e => setFormData({...formData, requirements: e.target.value})}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-wu-red text-sm font-body text-center bg-wu-red/10 border border-wu-red/20 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-wu-red hover:bg-wu-red/90 text-white font-display font-bold py-5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-wu-red/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Inquiry <Send size={18} /></>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h4 className="font-display font-black text-2xl uppercase tracking-tighter mb-2">Request Received</h4>
                  <p className="text-muted-foreground text-sm max-w-xs mb-8">
                    Your bulk order inquiry for <span className="text-foreground font-bold">{categoryName}</span> has been sent. Our team will contact you <span className="text-foreground font-bold italic">within 24 hours</span>.
                  </p>
                  <button 
                    onClick={onClose}
                    className="text-wu-red font-mono text-xs uppercase tracking-[0.2em] font-bold hover:underline"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-transparent via-wu-red to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
