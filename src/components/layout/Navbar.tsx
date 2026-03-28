'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { products } from '@/data';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const { cartCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Smart sticky navbar logic
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isTop, setIsTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsTop(latest < 50);
  });

  // Search Logic
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTop 
            ? 'bg-gradient-to-b from-black/60 to-transparent' 
            : 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[#E8161B] flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(232,22,27,0.4)]">
                <span className="text-white font-display font-black text-sm leading-none">W</span>
              </div>
              <span className="font-display font-black text-lg tracking-[0.2em] text-white">WEARUP</span>
            </Link>

            {/* Desktop Nav - ENLARGED FONT */}
            <div className="hidden md:flex items-center gap-2 mx-8 relative">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-display font-bold tracking-[0.1em] text-[#A0A0A0] hover:text-white transition-colors duration-300 uppercase overflow-hidden group/link"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute bottom-1 left-1/2 w-0 h-px bg-[#E8161B] -translate-x-1/2 group-hover/link:w-1/2 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
              >
                <Search size={16} />
              </button>

              <Link href="/wishlist" className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors hidden sm:flex">
                <Heart size={16} />
                {wishlist.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#E8161B] rounded-full text-[8px] font-bold text-white flex items-center justify-center shadow-lg"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </Link>

              <Link href="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors">
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#E8161B] rounded-full text-[8px] font-bold text-white flex items-center justify-center shadow-[0_0_10px_rgba(232,22,27,0.8)]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              
              <Link href="/login" className="w-10 h-10 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors hidden sm:flex">
                <User size={16} />
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors ml-1"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed top-20 sm:top-24 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl pointer-events-auto"
          >
            <form onSubmit={handleSearchSubmit} className="bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3">
              <Search size={20} className="text-[#666] ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protective gear, exhausts..."
                autoFocus
                className="w-full bg-transparent text-white placeholder-[#555] px-2 py-3 font-body text-sm sm:text-base focus:outline-none"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="w-10 h-10 shrink-0 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </form>

            {/* LIVE RESULTS DROPDOWN */}
            {searchQuery.trim() !== '' && (
              <div className="mt-2 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                {searchResults.length > 0 ? (
                  <>
                    <div className="flex flex-col">
                      {searchResults.map(p => (
                        <Link 
                          key={p.id} 
                          href={`/shop/${p.category}/${p.id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded bg-white/5 overflow-hidden shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-display font-bold text-sm truncate">{p.name}</h4>
                            <p className="text-[#888] font-mono text-[10px] uppercase tracking-wider">{p.category.replace('-', ' ')}</p>
                          </div>
                          <div className="text-white font-mono text-sm">
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full p-4 text-center text-[#E8161B] border-t border-white/5 font-display font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition-colors"
                    >
                      See all results for "{searchQuery}" <ArrowRight size={14} className="inline ml-1 mb-0.5" />
                    </button>
                  </>
                ) : (
                  <div className="p-8 text-center text-[#888] font-body text-sm">
                    No gear found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Full Screen Mobile Menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col pt-6 px-6"
        >
          <div className="flex items-center justify-between mb-12">
            <span className="font-display font-black text-xl tracking-[0.2em] text-white">WEARUP</span>
            <button onClick={() => setMobileOpen(false)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <motion.div 
                key={link.href}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="border-b border-white/10 pb-6"
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display font-black text-5xl text-white/90 hover:text-[#E8161B] transition-colors tracking-tight uppercase"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-auto mb-12 flex gap-4"
          >
            <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 bg-[#E8161B] text-white font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl">
              Login
            </Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex-1 bg-white/5 border border-white/10 text-white font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl">
              Cart ({cartCount})
            </Link>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
