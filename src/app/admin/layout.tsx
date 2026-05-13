'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Users, 
  Settings, Bell, Search, LogOut, ChevronRight, Menu,
  Layers, Wrench, Shirt, Package, Tag, MessageSquare,
  CheckCheck, ShoppingCart, AlertCircle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Graphic Kits', href: '/admin/graphic-kits', icon: Layers },
  { label: 'Bike Acc.', href: '/admin/bike-accessories', icon: Wrench },
  { label: 'T-Shirts', href: '/admin/t-shirts', icon: Shirt },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Form Requests', href: '/admin/form-requests', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

// Placeholder notifications — replace with real data fetch later
const MOCK_NOTIFICATIONS = [
  { id: 1, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'New Order Received', desc: 'Order #1042 — Fog Lights Kit', time: '2 min ago', unread: true },
  { id: 2, icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Low Stock Alert', desc: 'Crash Guard — only 2 left', time: '1 hr ago', unread: true },
  { id: 3, icon: CheckCheck, color: 'text-green-400', bg: 'bg-green-500/10', title: 'Order Fulfilled', desc: 'Order #1038 shipped successfully', time: '3 hr ago', unread: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('AD');
  const notifRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch logged-in user for initials
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data?.user?.email || '';
      const name = data?.user?.user_metadata?.full_name || email;
      if (name) {
        const parts = name.trim().split(/[\s@]+/);
        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : parts[0].slice(0, 2).toUpperCase();
        setUserInitials(initials);
      }
    });
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#070707] flex text-white font-body selection:bg-[#E8161B] selection:text-white">
      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0A0A0A] border-r border-white/5 transition-all duration-500 ${sidebarOpen ? 'w-72' : 'w-20'} hidden md:flex flex-col`}>
        <div className="px-5 py-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 group overflow-hidden">
            <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/logo-011.png"
                alt="WearUp Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {sidebarOpen && (
              <div className="relative h-9 w-36 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/lgo.png"
                  alt="WearUp"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto scrollbar-hide pb-4">
          {adminLinks.map(link => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${
                  active 
                    ? 'bg-[#E8161B] text-white shadow-[0_10px_30px_rgba(232,22,27,0.2)]' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'group-hover:text-white'} />
                {sidebarOpen && <span className="font-display font-bold text-sm tracking-widest uppercase">{link.label}</span>}
                {active && sidebarOpen && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
           <button className="flex items-center gap-4 text-white/40 hover:text-[#E8161B] transition-colors w-full group">
             <LogOut size={20} />
             {sidebarOpen && <span className="font-display font-bold text-sm tracking-widest uppercase">Logout</span>}
           </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="h-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search Database..." 
                className="bg-white/5 border border-white/5 rounded-full py-2 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#E8161B]/50 focus:bg-white/10 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* ── NOTIFICATION BELL ── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className="relative w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#E8161B] hover:bg-white/10 transition-all"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E8161B] rounded-full animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-14 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h3 className="font-display font-black text-sm text-white uppercase tracking-widest">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-[#E8161B] text-white font-mono text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </div>

                  {/* Notification Items */}
                  <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map(n => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer hover:bg-white/[0.03] ${n.unread ? 'bg-white/[0.02]' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon size={14} className={n.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-display font-bold text-xs uppercase tracking-wide truncate ${n.unread ? 'text-white' : 'text-white/50'}`}>{n.title}</p>
                            <p className="font-body text-xs text-white/40 mt-0.5 truncate">{n.desc}</p>
                            <p className="font-mono text-[9px] text-white/20 mt-1 uppercase tracking-widest">{n.time}</p>
                          </div>
                          {n.unread && <div className="w-1.5 h-1.5 bg-[#E8161B] rounded-full shrink-0 mt-1.5" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-white/5">
                    <button className="w-full text-center font-mono text-[10px] text-white/40 hover:text-[#E8161B] uppercase tracking-widest transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── USER AVATAR ── */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E8161B] to-[#ff4b4f] border-2 border-white/10 p-0.5 cursor-default" title="Admin User">
               <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center font-display font-black text-xs">
                 {userInitials}
               </div>
            </div>
          </div>
        </header>

        {/* Views */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
