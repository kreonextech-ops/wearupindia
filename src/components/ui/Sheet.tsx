'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Sheet({ isOpen, onClose, title, description, children }: SheetProps) {
  // Prevent scrolling when sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
          />

          {/* Sheet Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0A0A0A] border-l border-white/5 z-[100] shadow-2xl overflow-y-auto"
          >
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase opacity-50">// Admin Protocol</p>
                  <h2 className="font-display font-black text-3xl text-white tracking-tight uppercase">{title}</h2>
                  {description && (
                    <p className="text-white/40 text-sm font-body">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="py-4">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
