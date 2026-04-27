'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, ArrowRight, LogOut, ChevronDown, Facebook, Instagram } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { products, categories, services } from '@/data';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/5' 
            : 'bg-[#050505]/95 backdrop-blur-xl border-b border-border/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-wu-red text-white py-1 px-4 shadow-sm relative z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:block w-24" /> {/* Spacer */}
            
            <p className="font-display font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase text-center flex-1">
              WEARUP INDIA
            </p>

            <div className="flex items-center gap-4 w-24 justify-end">
              <Link href="https://www.facebook.com/wearupstore/" target="_blank" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                <Facebook size={14} />
              </Link>
              <Link href="https://www.instagram.com/wearup_ind" target="_blank" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                <Instagram size={14} />
              </Link>
              <Link href="#" target="_blank" className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                <svg 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full group gap-3">
              <div className="relative h-12 md:h-14 w-12 md:w-14 flex items-center transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src="/logo-011.png" 
                  alt="WearUp Logo" 
                  fill 
                  className="object-contain" 
                  priority 
                />
              </div>
              <div className="relative h-10 md:h-14 w-44 md:w-60 flex items-center transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src="/lgo.png" 
                  alt="WearUp Text" 
                  fill 
                  className="object-contain object-left" 
                  priority 
                />
              </div>
            </Link>

            {/* Desktop Nav - ENLARGED FONT */}
            <div className="hidden md:flex items-center gap-2 mx-8 relative">
              {navLinks.map(link => {
                const hasDropdown = link.label === 'Shop' || link.label === 'Services';
                const dropdownItems = link.label === 'Shop' 
                  ? categories.map(c => ({ name: c.name, href: `/shop/${c.slug}` }))
                  : link.label === 'Services'
                  ? services.map(s => ({ name: s.name, href: `/services/${s.slug}` }))
                  : [];

                return (
                  <div key={link.href} className="group/dropdown relative px-1 py-6 -my-6">
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 text-sm font-display font-bold tracking-[0.1em] text-white/80 hover:text-white transition-colors duration-300 uppercase flex items-center gap-1.5 group/link"
                    >
                      <span className="relative z-10">{link.label}</span>
                      {hasDropdown && (
                        <ChevronDown size={14} className="group-hover/dropdown:rotate-180 transition-transform duration-300 relative z-10 mt-0.5 text-wu-red" />
                      )}
                      <span className="absolute bottom-1 left-1/2 w-0 h-px bg-[#E8161B] -translate-x-1/2 group-hover/link:w-1/2 transition-all duration-300" />
                    </Link>

                    {/* Premium Dropdown */}
                    {hasDropdown && (
                      <div className="absolute top-[100%] left-4 w-72 pt-4 opacity-0 -translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300 z-50">
                        <div className="bg-[#050505] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden p-3 flex flex-col gap-1 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
                          {dropdownItems.map(item => (
                            <Link 
                              key={item.href} 
                              href={item.href}
                              className="relative z-10 px-5 py-3.5 text-xs font-display font-bold uppercase tracking-widest text-[#888] hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center justify-between group/sub"
                            >
                              <span>{item.name}</span>
                              <ArrowRight size={14} className="opacity-0 -translate-x-3 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-[#E8161B]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Search size={16} />
              </button>

              <Link href="/wishlist" className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5 transition-colors hidden sm:flex">
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

              <Link href="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5 transition-colors">
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
              
              {/* Auth User Menu */}
              <div className="relative group/auth">
                <Link 
                  href={user ? "/profile" : "/login"} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                    user 
                      ? 'text-wu-red bg-wu-red/10 border-wu-red/20 shadow-wu-red/10' 
                      : 'text-white/80 bg-white/5 hover:bg-white/10 border-transparent hover:text-white'
                  } hidden sm:flex`}
                >
                  <User size={16} />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-4 opacity-0 group-hover/auth:opacity-100 pointer-events-none group-hover/auth:pointer-events-auto transition-all duration-300 w-48 z-50">
                  <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden p-2">
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-border/50 mb-1">
                          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors font-display font-medium">
                          Profile Details
                        </Link>
                        <Link href="/profile" className="flex items-center px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors font-display font-medium">
                          My Orders
                        </Link>
                        <Link href="/wishlist" className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors font-display font-medium">
                          <span>Wishlist</span>
                          {wishlist.length > 0 && <span className="text-[10px] bg-wu-red text-white px-1.5 py-0.5 rounded-full">{wishlist.length}</span>}
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-wu-red hover:bg-wu-red/10 rounded-xl transition-colors font-display font-medium mt-1 border-t border-border/50"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-2 pb-2">
                          <p className="text-xs text-muted-foreground font-body text-center mt-2 mb-3">Join the club for faster checkout and exclusive drops.</p>
                          <Link href="/login" className="flex items-center justify-center w-full py-2.5 bg-wu-red text-white font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-wu-red/90 transition-all shadow-md">
                            Login
                          </Link>
                          <Link href="/login" className="flex items-center justify-center w-full py-2.5 mt-2 bg-background border border-border text-foreground font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-foreground/5 transition-all">
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/5 transition-colors ml-1"
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
            <form onSubmit={handleSearchSubmit} className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3">
              <Search size={20} className="text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protective gear, exhausts..."
                autoFocus
                className="w-full bg-transparent text-foreground placeholder-muted-foreground px-2 py-3 font-body text-sm sm:text-base focus:outline-none"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="w-10 h-10 shrink-0 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground flex items-center justify-center transition-colors">
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
          className="fixed inset-0 z-[100] bg-background flex flex-col pt-6 px-6"
        >
          <div className="flex items-center justify-between mb-12">
            <span className="font-display font-black text-xl tracking-[0.2em] text-foreground dark:text-white">WEARUP</span>
            <button onClick={() => setMobileOpen(false)} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto pb-10">
            {navLinks.map((link, i) => {
              const hasDropdown = link.label === 'Shop' || link.label === 'Services';
              const dropdownItems = link.label === 'Shop' 
                ? categories.map(c => ({ name: c.name, href: `/shop/${c.slug}` }))
                : link.label === 'Services'
                ? services.map(s => ({ name: s.name, href: `/services/${s.slug}` }))
                : [];

              return (
                <motion.div 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="border-b border-white/10 pb-6"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display font-black text-5xl text-white/90 hover:text-[#E8161B] transition-colors tracking-tight uppercase flex items-center justify-between"
                  >
                    {link.label}
                  </Link>

                  {/* Mobile Sub-menu rendering */}
                  {hasDropdown && (
                    <div className="flex flex-col gap-4 mt-6 ml-4 border-l border-white/10 pl-4">
                      {dropdownItems.map(item => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="font-display font-bold text-lg text-[#888] hover:text-white transition-colors tracking-widest uppercase flex items-center gap-3 group"
                        >
                          <span className="w-4 h-px bg-[#E8161B]/50 group-hover:bg-[#E8161B] transition-colors" /> {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-auto mb-12 flex flex-col gap-3"
          >
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="bg-[#E8161B] text-white font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl">
                  My Profile
                </Link>
                <button 
                  onClick={() => { handleSignOut(); setMobileOpen(false); }} 
                  className="bg-white/5 border border-white/10 text-[#666] font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="bg-[#E8161B] text-white font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl">
                  Login
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="bg-white/5 border border-white/10 text-white font-display font-bold text-center py-5 tracking-widest uppercase rounded-xl">
                  Cart ({cartCount})
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
