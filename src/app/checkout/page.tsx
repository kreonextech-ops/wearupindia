'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowLeft, ArrowRight, Lock, AlertCircle, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/data';
import { createClient } from '@/lib/supabase/client';

type Step = 'address' | 'payment' | 'confirm';

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<Step>('address');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [savedAddress, setSavedAddress] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile?.shipping_address || profile?.full_name || profile?.phone_number) {
          setSavedAddress({ ...profile, email: user.email });
        }
      }
    }
    loadProfile();
  }, []);

  const handleUseSavedAddress = () => {
    if (!savedAddress) return;
    const addr = savedAddress.shipping_address || {};
    const nameParts = (savedAddress.full_name || '').split(' ');
    setForm(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: savedAddress.email || '',
      phone: savedAddress.phone_number || '',
      address: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.zip || '',
    }));
  };

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    paymentMethod: 'whatsapp',
    upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
  });

  // Load applied coupon from cart page (stored in localStorage)
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discountAmount: number; discountType: string; discountValue: number; couponId: string }>(null);
  useEffect(() => {
    const stored = localStorage.getItem('appliedCoupon');
    if (stored) {
      try { setAppliedCoupon(JSON.parse(stored)); } catch {}
    }
  }, []);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const shipping = cartTotal >= 499 ? 0 : 99;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const total = cartTotal + shipping - couponDiscount;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError('');
    const supabase = createClient();

    try {
      // 1. Get current user (may be null for guest — still save)
      const { data: { user } } = await supabase.auth.getUser();

      // 2. If user is logged in, upsert their profile with checkout info
      // Uses UPSERT so a profile row is created even if the signup trigger never fired
      if (user) {
        // Fetch current profile to preserve any existing data
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('full_name, phone_number, shipping_address')
          .eq('id', user.id)
          .maybeSingle();

        const checkoutName = `${form.firstName} ${form.lastName}`.trim();

        // Build upsert payload — keyed by id (auth UUID) + email
        const profileUpsert: Record<string, any> = {
          id: user.id,
          email: user.email,
          role: existingProfile ? undefined : 'customer', // don't overwrite role if profile exists
          updated_at: new Date().toISOString(),
        };

        // Only update name if profile doesn't have one yet
        if (checkoutName && !existingProfile?.full_name) {
          profileUpsert.full_name = checkoutName;
        }

        // Only update phone if profile doesn't have one yet
        if (form.phone && !existingProfile?.phone_number) {
          profileUpsert.phone_number = form.phone;
        }

        // Always update shipping address with the latest checkout address
        if (form.address && form.city && form.state) {
          profileUpsert.shipping_address = {
            street: form.address,
            city: form.city,
            state: form.state,
            zip: form.pincode,
          };
        }

        // Remove undefined fields before upserting
        Object.keys(profileUpsert).forEach(k => profileUpsert[k] === undefined && delete profileUpsert[k]);

        const { error: profileUpsertErr } = await supabase
          .from('profiles')
          .upsert(profileUpsert, { onConflict: 'id' });

        if (profileUpsertErr) {
          console.error('Profile sync error:', profileUpsertErr.message);
          // Not a blocker — order still proceeds
        }
      }

      // 3. Build shipping address snapshot
      const shippingAddress = {
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        street: form.address,
        city: form.city,
        state: form.state,
        zip: form.pincode,
      };

      // 4. Create the Order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id ?? null,
          total_amount: total,
          status: 'pending',
          payment_status: form.paymentMethod === 'whatsapp' ? 'unpaid' : 'paid',
          shipping_address: shippingAddress,
          payment_intent_id: form.paymentMethod === 'upi'
            ? form.upiId
            : form.paymentMethod === 'card'
              ? `card-${form.cardNumber.slice(-4)}`
              : 'whatsapp',
        }])
        .select()
        .single();

      if (orderError || !order) {
        console.error('Order creation error:', orderError);
        throw new Error(orderError?.message ?? 'Failed to create order');
      }

      // 5. Resolve product IDs from slugs and create order_items
      for (const item of cart) {
        const { data: product } = await supabase
          .from('products')
          .select('id')
          .eq('slug', item.slug)
          .single();

        if (product) {
          await supabase.from('order_items').insert([{
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
          }]);
        }
      }

      // 6. Clear cart and mark placed — also log coupon usage if any
      const finalOrderId = `WU-${order.id.slice(0, 8).toUpperCase()}`;
      setOrderId(finalOrderId);

      if (appliedCoupon) {
        // Log coupon usage
        await supabase.from('coupon_usages').insert([{
          coupon_id: appliedCoupon.couponId,
          coupon_code: appliedCoupon.code,
          order_id: order.id,
          customer_name: `${form.firstName} ${form.lastName}`.trim(),
          customer_email: form.email,
          order_total: total,
          discount_applied: appliedCoupon.discountAmount,
        }]);

        // Atomically increment times_used: fetch current then update
        const { data: currentCoupon } = await supabase
          .from('coupons')
          .select('times_used')
          .eq('code', appliedCoupon.code)
          .single();
        if (currentCoupon) {
          await supabase
            .from('coupons')
            .update({ times_used: (currentCoupon.times_used || 0) + 1 })
            .eq('code', appliedCoupon.code);
        }

        localStorage.removeItem('appliedCoupon');
      }

      clearCart();
      
      // 7. If WhatsApp, redirect to WhatsApp with order details
      if (form.paymentMethod === 'whatsapp') {
        const hasGraphicKits = cart.some((item: any) => item.category === 'graphic-kits');
        const adminPhone = hasGraphicKits ? "916296396462" : "919093543071";
        
        let message = `*New Order: ${finalOrderId}*%0A%0A`;
        message += `*Customer Details:*%0A`;
        message += `Name: ${form.firstName} ${form.lastName}%0A`;
        message += `Phone: ${form.phone}%0A`;
        message += `Email: ${form.email}%0A%0A`;
        
        message += `*Shipping Address:*%0A`;
        message += `${form.address}, ${form.city}, ${form.state} - ${form.pincode}%0A%0A`;
        
        message += `*Order Items:*%0A`;
        cart.forEach((item, index) => {
           let productUrl = `${window.location.origin}/shop/${item.category}/${item.slug}`;
           message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.price}%0A`;
           message += `Link: ${productUrl}%0A`;
        });
        
        message += `%0A*Total Amount:* ₹${total}%0A`;
        
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      }

      setOrderPlaced(true);
    } catch (err: any) {
      setPlaceError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-500" />
          </div>
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Order Confirmed</p>
          <h1 className="font-display font-black text-4xl text-white mb-4">YOU&apos;RE ALL SET!</h1>
          <p className="font-body text-[#666] mb-2 text-sm">Order <span className="text-[#E8161B] font-mono font-bold">{orderId}</span> has been placed.</p>
          <p className="font-body text-[#555] mb-8 text-sm">You&apos;ll receive a confirmation on your email &amp; WhatsApp shortly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors">
              Continue Shopping
            </Link>
            <Link href="/" className="flex items-center justify-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:text-white hover:border-[#444] transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-4xl text-white mb-4">NOTHING TO CHECKOUT</h1>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Delivery' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  const inputClass = "w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white placeholder-[#444] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors";
  const labelClass = "font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1 block";

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cart" className="flex items-center gap-2 text-[#666] hover:text-white text-xs font-mono tracking-widest uppercase mb-8 transition-colors w-fit">
          <ArrowLeft size={12} /> Back to Cart
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 ${i <= stepIndex ? 'bg-[#E8161B]' : 'bg-[#111] border border-[#2a2a2a]'}`}>
                <span className={`font-mono text-xs font-bold ${i <= stepIndex ? 'text-white' : 'text-[#444]'}`}>
                  {i < stepIndex ? <Check size={12} /> : i + 1}
                </span>
                <span className={`font-display font-bold text-xs tracking-widest uppercase ${i <= stepIndex ? 'text-white' : 'text-[#444]'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px ${i < stepIndex ? 'bg-[#E8161B]' : 'bg-[#2a2a2a]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* ADDRESS STEP */}
            {step === 'address' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-black text-2xl text-white">DELIVERY ADDRESS</h2>
                  {savedAddress && (
                    <button 
                      onClick={handleUseSavedAddress}
                      className="flex items-center gap-2 bg-[#E8161B]/10 text-[#E8161B] hover:bg-[#E8161B]/20 px-3 py-1.5 rounded-lg border border-[#E8161B]/20 font-mono text-[9px] uppercase tracking-widest transition-colors"
                    >
                      <MapPin size={12} /> Use Saved Address
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input className={inputClass} placeholder="Rahul" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input className={inputClass} placeholder="Sharma" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="rahul@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Full Address</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Street, Area, Landmark" value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} placeholder="Bengaluru" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <select className={inputClass} value={form.state} onChange={e => update('state', e.target.value)}>
                      <option value="">Select</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input className={inputClass} placeholder="560001" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                  </div>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors"
                >
                  Continue to Payment <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === 'payment' && (() => {
              const hasBikeAccessories = cart.some((item: any) => item.category === 'bike-accessories');
              const paymentOptions = [
                ...(!hasBikeAccessories ? [{ key: 'upi', label: 'UPI Payment', sub: 'Google Pay, PhonePe, Paytm, etc.' }] : []),
                { key: 'whatsapp', label: 'Order via WhatsApp', sub: 'Place order directly with admin' },
              ];
              return (
                <div className="space-y-6">
                  <h2 className="font-display font-black text-2xl text-white">PAYMENT METHOD</h2>
                  <div className="space-y-3">
                    {paymentOptions.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => update('paymentMethod', opt.key)}
                        className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${
                          form.paymentMethod === opt.key
                            ? 'border-[#E8161B] bg-[#E8161B]/5'
                            : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.paymentMethod === opt.key ? 'border-[#E8161B]' : 'border-[#444]'}`}>
                          {form.paymentMethod === opt.key && <div className="w-2 h-2 rounded-full bg-[#E8161B]" />}
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-white">{opt.label}</p>
                          <p className="font-mono text-[10px] text-[#555]">{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {form.paymentMethod === 'upi' && (
                    <div>
                      <label className={labelClass}>UPI ID</label>
                      <input className={inputClass} placeholder="name@upi" value={form.upiId} onChange={e => update('upiId', e.target.value)} />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')} className="flex items-center gap-2 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-6 py-4 hover:text-white hover:border-[#444] transition-colors">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={() => setStep('confirm')} className="flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors">
                      Review Order <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* CONFIRM STEP */}
            {step === 'confirm' && (
              <div className="space-y-6">
                <h2 className="font-display font-black text-2xl text-white">REVIEW &amp; CONFIRM</h2>
                <div className="p-5 bg-[#111] border border-[#1a1a1a]">
                  <h3 className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-3">Delivery To</h3>
                  <p className="font-display font-bold text-white">{form.firstName} {form.lastName}</p>
                  <p className="font-body text-[#666] text-sm">{form.address}</p>
                  <p className="font-body text-[#666] text-sm">{form.city}, {form.state} – {form.pincode}</p>
                  <p className="font-mono text-[11px] text-[#555] mt-1">{form.phone}</p>
                </div>
                <div className="p-5 bg-[#111] border border-[#1a1a1a]">
                  <h3 className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-3">Payment</h3>
                  <p className="font-display font-bold text-white capitalize">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod.toUpperCase()}</p>
                </div>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-center p-3 bg-[#111] border border-[#1a1a1a]">
                      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden bg-[#181818]">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-white truncate">{item.name}</p>
                        <p className="font-mono text-[10px] text-[#555]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-display font-bold text-sm text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {placeError && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <p className="font-mono text-xs text-red-400">{placeError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="flex items-center gap-2 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-6 py-4 hover:text-white hover:border-[#444] transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase py-4 hover:bg-[#B81015] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {placing ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
                    ) : (
                      <><Lock size={14} /> Place Order · {formatPrice(total)}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-[#111] border border-[#1a1a1a] p-6 sticky top-24">
              <h2 className="font-display font-black text-lg text-white mb-4 pb-4 border-b border-[#1a1a1a]">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-body text-[#666] truncate max-w-[140px]">{item.name} ×{item.quantity}</span>
                    <span className="font-display font-bold text-white flex-shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[#666]">Subtotal</span>
                  <span className="font-display font-bold text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[#666]">Shipping</span>
                  <span className={`font-display font-bold ${shipping === 0 ? 'text-green-500' : 'text-white'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-[10px] text-green-400">Coupon: {appliedCoupon.code}</span>
                    <span className="font-display font-bold text-green-400">−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center border-t border-[#1a1a1a] pt-4 mt-4">
                <span className="font-display font-black text-base text-white">TOTAL</span>
                <span className="font-display font-black text-xl text-[#E8161B]">{formatPrice(Math.max(0, total))}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                <Lock size={12} className="text-[#555]" />
                <span className="font-mono text-[10px] text-[#555]">256-bit SSL secured checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
