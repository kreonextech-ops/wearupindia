'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Users, 
  Settings, Bell, Search, LogOut, ChevronRight, Menu,
  Layers, Wrench, Shirt, Package, Tag, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const supabase = createClient();

  return (
    <div className="min-h-screen bg-[#070707] flex text-white font-body selection:bg-[#E8161B] selection:text-white">
      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0A0A0A] border-r border-white/5 transition-all duration-500 ${sidebarOpen ? 'w-72' : 'w-20'} hidden md:flex flex-col`}>
        <div className="px-5 py-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 group overflow-hidden">
            {/* Icon logo — always visible */}
            <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/logo-011.png"
                alt="WearUp Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Text logo — only when expanded */}
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
            <button className="relative w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#E8161B] transition-colors">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#E8161B] rounded-full animate-pulse" />
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E8161B] to-[#ff4b4f] border-2 border-white/10 p-0.5">
               <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center font-display font-black text-xs">
                 RE
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
