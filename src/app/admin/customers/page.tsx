'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Mail, Phone, MapPin, Calendar,
  ShoppingCart, Shield, UserIcon, Package,
  ShoppingBag, Heart, X
} from 'lucide-react';
import { formatINR } from '@/lib/analytics';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  shipping_address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  role: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

interface OrderItem {
  id: string;
  product: {
    name: string;
    images: string[];
  };
  quantity: number;
  price_at_purchase: number;
}

interface CustomerOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

interface ProductInfo {
  id: string;
  name: string;
  images: string[];
  price: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerCart, setCustomerCart] = useState<any[]>([]);
  const [customerWishlist, setCustomerWishlist] = useState<ProductInfo[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error.message);
      setLoading(false);
      return;
    }

    // For each profile, pull order stats
    const enriched: Customer[] = await Promise.all(
      (profiles ?? []).map(async (p) => {
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', p.id);

        const order_count = orders?.length ?? 0;
        const total_spent = orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0;

        return { ...p, order_count, total_spent };
      })
    );

    setCustomers(enriched);
    setLoading(false);
  };

  const fetchCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsLoading(true);

    // 1. Fetch Orders
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product:products (
            name,
            images
          )
        )
      `)
      .eq('user_id', customer.id)
      .order('created_at', { ascending: false });

    setCustomerOrders(orders as any || []);

    // 2. Fetch Cart
    const { data: cartData } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', customer.id)
      .single();

    if (cartData?.items && Array.isArray(cartData.items)) {
      const enrichedCart = await Promise.all(
        cartData.items.map(async (item: any) => {
          const { data: product } = await supabase
            .from('products')
            .select('id, name, images, price')
            .eq('id', item.product_id)
            .single();
          return { ...item, product };
        })
      );
      setCustomerCart(enrichedCart.filter(i => i.product));
    } else {
      setCustomerCart([]);
    }

    // 3. Fetch Wishlist
    const { data: wishlistData } = await supabase
      .from('wishlists')
      .select('items')
      .eq('user_id', customer.id)
      .single();

    if (wishlistData?.items && Array.isArray(wishlistData.items)) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, images, price')
        .in('id', wishlistData.items);
      setCustomerWishlist(products || []);
    } else {
      setCustomerWishlist([]);
    }

    setDetailsLoading(false);
  };

  const filtered = customers.filter(c =>
    !search ||
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number?.includes(search) ||
    c.shipping_address?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// Customer Management</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Customers</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">
            {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8161B] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E8161B]/50 w-full md:w-80 transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <Users size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Customers Found</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">
            Customers appear here automatically after they register or place an order
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((customer, i) => {
            const addr = customer.shipping_address;
            const hasAddress = addr && (addr.street || addr.city);
            const initial = (customer.full_name?.[0] ?? customer.email?.[0] ?? '?').toUpperCase();

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => fetchCustomerDetails(customer)}
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-wu-red/30 cursor-pointer transition-all group relative overflow-hidden"
              >
                {/* Click Hint */}
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[8px] font-mono text-wu-red uppercase tracking-widest bg-wu-red/10 px-2 py-1 rounded-md border border-wu-red/20">Click to View Details</div>
                </div>
                <div className="flex flex-wrap gap-6">
                  {/* Avatar + Basic Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E8161B] to-[#ff4b4f] flex items-center justify-center text-white font-display font-black text-base flex-shrink-0 shadow-lg shadow-[#E8161B]/20">
                      {initial}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-base text-white truncate">
                          {customer.full_name || 'No Name'}
                        </h3>
                        {customer.role === 'admin' && (
                          <span className="flex items-center gap-1 bg-[#E8161B]/20 text-[#E8161B] px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase">
                            <Shield size={8} /> Admin
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-white/30 flex items-center gap-1.5 truncate">
                        <Mail size={9} /> {customer.email}
                      </p>
                      <p className={`font-mono text-[10px] flex items-center gap-1.5 ${customer.phone_number ? 'text-white/40' : 'text-white/15 italic'}`}>
                        <Phone size={9} />
                        {customer.phone_number ?? 'No phone on file'}
                      </p>
                      <p className="font-mono text-[9px] text-white/20 flex items-center gap-1.5">
                        <Calendar size={9} />
                        Joined {new Date(customer.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <MapPin size={9} className="text-[#E8161B]" /> Shipping Address
                    </p>
                    {hasAddress ? (
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                        {addr.street && <p className="font-body text-sm text-white/70">{addr.street}</p>}
                        <p className="font-body text-xs text-white/40">
                          {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/3 border border-dashed border-white/10 rounded-xl p-3">
                        <p className="font-mono text-[9px] text-white/20 uppercase italic">Not provided yet</p>
                        <p className="font-mono text-[8px] text-white/10 mt-1 uppercase">Will be filled when they checkout</p>
                      </div>
                    )}
                  </div>

                  {/* Order Stats */}
                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-center">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-1 flex items-center gap-1 justify-center">
                        <ShoppingCart size={9} /> Orders
                      </p>
                      <p className={`font-display font-black text-xl ${(customer.order_count ?? 0) > 0 ? 'text-white' : 'text-white/20'}`}>
                        {customer.order_count ?? 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-1 flex items-center gap-1 justify-center">
                        <Package size={9} /> Spent
                      </p>
                      <p className={`font-display font-black text-lg ${(customer.total_spent ?? 0) > 0 ? 'text-[#E8161B]' : 'text-white/20'}`}>
                        {(customer.total_spent ?? 0) > 0 ? formatINR(customer.total_spent!) : '₹0'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── CUSTOMER DETAIL OVERLAY ─── */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Side Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#050505] border-l border-white/10 h-full overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-8 border-b border-white/5 bg-[#0A0A0A] sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-wu-red to-[#ff4b4f] flex items-center justify-center text-white font-display font-black text-xl shadow-xl shadow-wu-red/20">
                    {(selectedCustomer.full_name?.[0] ?? selectedCustomer.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                      {selectedCustomer.full_name || 'No Name'}
                    </h2>
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{selectedCustomer.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {detailsLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="w-10 h-10 border-2 border-wu-red border-t-transparent rounded-full animate-spin" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-wu-red">Scanning Database...</p>
                </div>
              ) : (
                <div className="p-8 space-y-12">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-2">Total Orders</p>
                      <p className="font-display font-black text-3xl text-white">{selectedCustomer.order_count}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <p className="font-mono text-[9px] text-white/20 uppercase mb-2">Lifetime Value</p>
                      <p className="font-display font-black text-3xl text-wu-red">{formatINR(selectedCustomer.total_spent || 0)}</p>
                    </div>
                  </div>

                  {/* Orders Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="text-wu-red" size={18} />
                      <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Past Orders</h3>
                    </div>
                    {customerOrders.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center opacity-30">
                        <p className="font-mono text-[10px] uppercase tracking-widest">No orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customerOrders.map(order => (
                          <div key={order.id} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="font-mono text-[10px] text-white/40 uppercase mb-1">
                                  Order #{order.id.slice(0, 8)}
                                </p>
                                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-white mb-1">{formatINR(order.total_amount)}</p>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-wu-red/20 text-wu-red border border-wu-red/20">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            {/* Items in this order */}
                            <div className="space-y-2 pt-4 border-t border-white/5">
                              {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-[11px]">
                                  <span className="text-white/60">{item.quantity}x {item.product?.name}</span>
                                  <span className="text-white/40">{formatINR(item.price_at_purchase)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Cart Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="text-wu-red" size={18} />
                      <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Current Cart</h3>
                    </div>
                    {customerCart.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center opacity-30">
                        <p className="font-mono text-[10px] uppercase tracking-widest">Cart is empty</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {customerCart.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-black shrink-0">
                              <img src={item.product?.images?.[0]} alt="" className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-bold text-xs text-white truncate">{item.product?.name}</p>
                              <p className="font-mono text-[9px] text-white/30 uppercase">{item.size || 'One Size'} · Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-[10px] text-white/60 font-bold">{formatINR(item.product?.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Wishlist Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Heart className="text-wu-red" size={18} />
                      <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Wishlist</h3>
                    </div>
                    {customerWishlist.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center opacity-30">
                        <p className="font-mono text-[10px] uppercase tracking-widest">Wishlist is empty</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {customerWishlist.map(product => (
                          <div key={product.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-3">
                            <div className="aspect-square relative rounded-lg overflow-hidden bg-black">
                              <img src={product.images?.[0]} alt="" className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <p className="font-display font-bold text-[10px] text-white truncate uppercase">{product.name}</p>
                              <p className="font-mono text-[9px] text-wu-red mt-1 font-bold">{formatINR(product.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
