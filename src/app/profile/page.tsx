'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  MapPin, 
  ShoppingBag, 
  Settings, 
  Shield, 
  LogOut,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  Phone,
  Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProfileAction, updateAddressAction } from './actions';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'address' | 'settings'>('overview');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch Profile Data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profile);

      // Fetch Orders Data
      const { data: orders, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOrders(orders || []);
      setOrderCount(count || 0);
      setLoading(false);
    };
    getData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8161B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'address', label: 'Shipping Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2">// Account Details</p>
              <h1 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight uppercase">
                Welcome back, <span className="text-[#E8161B]">{user.user_metadata?.full_name?.split(' ')[0] || 'Customer'}</span>
              </h1>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E8161B] to-[#ff4d4d] flex items-center justify-center text-white font-display font-black text-xl">
                {user.user_metadata?.full_name?.[0] || 'R'}
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wider">{user.user_metadata?.full_name || 'Valued Customer'}</p>
                <p className="font-mono text-[9px] text-[#555] uppercase">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                  activeTab === link.id 
                    ? 'bg-[#E8161B] text-white shadow-[0_10px_30px_rgba(232,22,27,0.2)]' 
                    : 'bg-white/5 text-[#888] hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} />
                  <span className="font-display font-bold text-xs uppercase tracking-widest">{link.label}</span>
                </div>
                <ChevronRight size={16} className={`${activeTab === link.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
              </button>
            ))}
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-[#ff4d4d] bg-white/[0.02] hover:bg-[#ff4d4d]/10 transition-all mt-8 group"
            >
              <LogOut size={20} />
              <span className="font-display font-bold text-xs uppercase tracking-widest">Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[600px] backdrop-blur-xl relative overflow-hidden group">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8161B]/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-[#E8161B]/10 transition-all duration-700" />
              
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                  <h2 className="font-display font-black text-3xl text-white mb-8 uppercase tracking-tight">Account Dashboard</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                      <Clock size={24} className="text-[#E8161B] mb-4" />
                      <p className="font-mono text-[9px] text-[#555] uppercase tracking-[2px] mb-1">Member Since</p>
                      <p className="font-display font-black text-2xl text-white uppercase">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                      <ShoppingBag size={24} className="text-[#E8161B] mb-4" />
                      <p className="font-mono text-[9px] text-[#555] uppercase tracking-[2px] mb-1">Total Orders</p>
                      <p className="font-display font-black text-2xl text-white">{orderCount} ORDERS</p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                      <Shield size={24} className="text-[#E8161B] mb-4" />
                      <p className="font-mono text-[9px] text-[#555] uppercase tracking-[2px] mb-1">Account Status</p>
                      <p className="font-display font-black text-2xl text-white">{profile?.role === 'admin' ? 'ADMINISTRATOR' : 'LOYAL CUSTOMER'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2">
                       Current Orders <span className="bg-[#E8161B]/20 text-[#E8161B] px-2 py-0.5 rounded text-[10px]">{orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</span>
                    </h3>
                    
                    {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 0 ? (
                      orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map((order) => (
                        <div key={order.id} className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-[#E8161B]">
                              <Package size={24} />
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm text-white uppercase tracking-wider">Order Items</p>
                              <p className="font-mono text-[10px] text-[#888]">ORDER #WUP-{order.id.slice(0, 4).toUpperCase()} // {order.status.toUpperCase()}</p>
                            </div>
                          </div>
                          <Link href={`/orders/${order.id}`} className="bg-[#E8161B] text-white font-display font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#B81015] transition-colors text-center">
                            Track Order
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/5 rounded-2xl p-12 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#444] mb-4">
                          <Shield size={24} />
                        </div>
                        <h4 className="font-display font-bold text-sm text-white uppercase tracking-widest mb-2">No Active Orders</h4>
                        <p className="font-body text-xs text-[#555] max-w-[250px]">Your current order list is clear. Ready for your next purchase?</p>
                        <Link href="/shop" className="mt-6 text-[#E8161B] font-display font-bold text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                          Continue Shopping →
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                  <h2 className="font-display font-black text-3xl text-white mb-8 uppercase tracking-tight">Order History</h2>
                  
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.id} className="bg-black/20 border border-white/5 rounded-2xl p-5 hover:bg-black/40 transition-all group/order">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0">
                                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center">
                                  <Package size={24} className="text-white/10" />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle2 size={12} className={order.status === 'delivered' ? 'text-green-500' : 'text-[#E8161B]'} />
                                  <span className={`font-mono text-[9px] uppercase tracking-widest font-bold ${order.status === 'delivered' ? 'text-green-500' : 'text-[#E8161B]'}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <h4 className="font-display font-bold text-sm text-white uppercase group-hover/order:text-[#E8161B] transition-colors">Order Detail</h4>
                                <p className="font-mono text-[10px] text-[#555] uppercase mb-4">
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} // ₹{order.total_amount}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={`/orders/${order.id}`} className="flex-1 md:flex-none border border-white/10 hover:border-white/20 text-center text-white font-display font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-lg transition-all">Details</Link>
                              <button className="flex-1 md:flex-none bg-[#E8161B]/10 hover:bg-[#E8161B] text-[#E8161B] hover:text-white border border-[#E8161B]/20 font-display font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-lg transition-all">Buy Again</button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/5 rounded-2xl p-20 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <ShoppingBag size={48} className="text-[#222] mb-6" />
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest mb-2">No Past Orders</h3>
                        <p className="font-body text-xs text-[#555] max-w-sm">You haven't placed any orders yet. Your order history will appear here once you purchase gear.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display font-black text-3xl text-white uppercase tracking-tight">Saved Addresses</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/40 border-2 border-[#E8161B] p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-[#E8161B] text-white font-mono text-[8px] px-2 py-1 rounded uppercase font-black tracking-widest">Primary Address</div>
                      <MapPin size={24} className="text-[#E8161B] mb-6" />
                      
                      <form action={async (formData) => {
                        const address = {
                          street: formData.get('street'),
                          city: formData.get('city'),
                          state: formData.get('state'),
                          zip: formData.get('zip'),
                        };
                        setSaving(true);
                        await updateAddressAction(address);
                        setSaving(false);
                      }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="font-mono text-[9px] text-[#444] uppercase tracking-wider">Street Address</label>
                          <input name="street" defaultValue={profile?.shipping_address?.street || ''} placeholder="123 Rider Blvd" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#444] uppercase tracking-wider">City</label>
                            <input name="city" defaultValue={profile?.shipping_address?.city || ''} placeholder="Bengaluru" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#444] uppercase tracking-wider">State</label>
                            <input name="state" defaultValue={profile?.shipping_address?.state || ''} placeholder="KA" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[9px] text-[#444] uppercase tracking-wider">ZIP / Postal</label>
                          <input name="zip" defaultValue={profile?.shipping_address?.zip || ''} placeholder="560001" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" />
                        </div>
                        <button type="submit" disabled={saving} className="w-full bg-white/5 hover:bg-[#E8161B] text-white font-display font-bold text-[10px] tracking-widest uppercase py-4 rounded-xl transition-all border border-white/10 hover:border-[#E8161B]">
                          {saving ? 'Saving...' : 'Update Address'}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center group/card transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#222] mb-6 group-hover:scale-110 group-hover:text-[#E8161B] transition-all">
                        <MapPin size={32} />
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#444] uppercase tracking-widest mb-2">Secondary Address</h4>
                      <p className="font-body text-xs text-[#222] max-w-[200px]">Alternate shipping routes are currently restricted.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                  <h2 className="font-display font-black text-3xl text-white mb-8 uppercase tracking-tight">Account Settings</h2>
                  
                    <form action={async (formData) => {
                      setSaving(true);
                      await updateProfileAction(formData);
                      setSaving(false);
                    }} className="max-w-xl space-y-8">
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-xs text-[#555] uppercase tracking-widest border-b border-white/5 pb-2">Profile Details</h4>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] text-[#444] uppercase tracking-wider">Full Name</label>
                            <input 
                              name="full_name"
                              type="text" 
                              defaultValue={profile?.full_name || user.user_metadata?.full_name} 
                              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] text-[#444] uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                              <input 
                                name="phone_number"
                                type="tel" 
                                defaultValue={profile?.phone_number || ''}
                                placeholder="+91 00000 00000" 
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-xs text-[#555] uppercase tracking-widest border-b border-white/5 pb-2">Communications</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body font-bold text-sm text-white">Order Updates via SMS</p>
                            <p className="font-body text-xs text-[#555]">Receive delivery updates directly on your phone</p>
                          </div>
                          <div className="w-12 h-6 bg-[#E8161B] rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={saving}
                        className="w-full bg-[#E8161B] text-white font-display font-black text-xs tracking-[0.3em] uppercase py-5 rounded-2xl shadow-[0_10px_40px_rgba(232,22,27,0.2)] hover:bg-[#B81015] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                      </button>
                    </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
