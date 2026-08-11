'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Tag } from 'lucide-react';

type PopupCoupon = {
  active: boolean;
  code?: string;
  discountType?: 'percent' | 'flat';
  discountValue?: number;
};

export default function CouponPopup() {
  const [coupon, setCoupon] = useState<PopupCoupon | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if the user already dismissed the popup in this session
    const hasDismissed = sessionStorage.getItem('wearup_coupon_dismissed');
    if (hasDismissed) return;

    // Fetch the active popup coupon
    const fetchPopupCoupon = async () => {
      try {
        const res = await fetch('/api/coupons/popup');
        const data = await res.json();
        
        if (data.active) {
          setCoupon(data);
          // Wait 5 seconds before showing the popup
          setTimeout(() => {
            setIsVisible(true);
          }, 5000);
        }
      } catch (err) {
        console.error('Failed to fetch popup coupon', err);
      }
    };

    fetchPopupCoupon();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('wearup_coupon_dismissed', 'true');
  };

  const handleCopy = () => {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!coupon || !coupon.active) return null;

  const discountText = coupon.discountType === 'percent' 
    ? `${coupon.discountValue}% OFF` 
    : `₹${coupon.discountValue} OFF`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full shadow-2xl"
        >
          <div className="bg-[#0A0A0A] border-2 border-[#E8161B] rounded-2xl overflow-hidden relative">
            {/* Header/Close */}
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={handleDismiss}
                className="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#E8161B] text-white/50 hover:text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Banner Area */}
            <div className="bg-[#E8161B] px-6 py-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Tag size={100} />
              </div>
              <p className="font-mono text-[10px] text-white/80 tracking-widest uppercase mb-1">Limited Time Offer</p>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight leading-none">
                Get {discountText}
              </h3>
            </div>
            
            {/* Content Area */}
            <div className="p-6">
              <p className="font-body text-sm text-[#888] mb-4">
                Use the coupon code below during checkout to grab this deal!
              </p>
              
              {/* Code Copier */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-center border-dashed">
                  <span className="font-mono font-bold text-lg text-white tracking-widest uppercase">
                    {coupon.code}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`h-full flex items-center justify-center px-4 py-3 rounded-lg border font-display font-bold text-xs uppercase tracking-widest transition-colors ${
                    copied 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
              
              <div className="flex items-center justify-center p-2 bg-yellow-400/10 rounded border border-yellow-400/20">
                <p className="font-mono text-[9px] text-yellow-400 uppercase tracking-widest text-center">
                  * Valid for prepaid orders (Graphic Kits only)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
