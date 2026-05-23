'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowLeft, ArrowRight, Lock, AlertCircle, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { load } from '@cashfreepayments/cashfree-js';
import { formatPrice } from '@/data';
import { createClient } from '@/lib/supabase/client';

type Step = 'address' | 'payment' | 'confirm';

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

function CheckoutInner() {
  const { cart, cartTotal, clearCart } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [savedAddress, setSavedAddress] = useState<any>(null);

  useEffect(() => {
    const orderIdParam = searchParams?.get('order_id');
    if (orderIdParam) {
      verifyPayment(orderIdParam);
    }
  }, [searchParams]);

  const verifyPayment = async (id: string) => {
    setPlacing(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();
      if (data.isPaid) {
        // Fetch order details to send the email
        const supabase = createClient();
        const { data: orderData } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price_at_purchase,
              products ( name )
            )
          `)
          .eq('payment_intent_id', id)
          .single();

        // Check if we need to update status (to prevent sending double emails if refreshed)
        if (orderData && orderData.payment_status !== 'paid') {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ payment_status: 'paid', status: 'processing' })
            .eq('payment_intent_id', id);
          if (updateError) {
            console.error('Supabase update error:', updateError);
          }

          // Send confirmation email
          try {
            const items = orderData.order_items?.map((item: any) => ({
              name: item.products?.name || 'Product',
              quantity: item.quantity,
              price: item.price_at_purchase
            })) || [];

            await fetch('/api/emails/order-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: orderData.shipping_address?.email,
                customerName: orderData.shipping_address?.full_name,
                orderId: id,
                totalAmount: orderData.total_amount,
                items: items
              }),
            });
          } catch (err) {
            console.error('Failed to send confirmation email:', err);
          }
        }

        setOrderId(id);
        setOrderPlaced(true);
        clearCart();
      } else {
        setPlaceError('Payment verification failed or payment is pending.');
      }
    } catch (err) {
      setPlaceError('Failed to verify payment.');
    } finally {
      setPlacing(false);
      router.replace('/checkout', { scroll: false });
    }
  };

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
    paymentMethod: 'online',
  });

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
  const hasGraphicKits = cart.some((item: any) => item.category === 'graphic-kits' || item.slug?.includes('graphic-kit'));

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError('');
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
        const checkoutName = `${form.firstName} ${form.lastName}`.trim();
        const profileUpsert: any = { id: user.id, email: user.email, updated_at: new Date().toISOString() };
        if (checkoutName && !existingProfile?.full_name) profileUpsert.full_name = checkoutName;
        if (form.phone) profileUpsert.phone_number = form.phone;
        if (form.address) profileUpsert.shipping_address = { street: form.address, city: form.city, state: form.state, zip: form.pincode };
        await supabase.from('profiles').upsert(profileUpsert, { onConflict: 'id' });
      }

      const shippingAddress = {
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        street: form.address,
        city: form.city,
        state: form.state,
        zip: form.pincode,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id ?? null,
          total_amount: total,
          status: 'pending',
          payment_status: 'unpaid',
          shipping_address: shippingAddress,
          payment_intent_id: form.paymentMethod === 'online' ? 'cashfree' : 'whatsapp',
        }])
        .select()
        .single();

      if (orderError || !order) throw new Error(orderError?.message ?? 'Failed to create order');

      for (const item of cart) {
        const { data: product } = await supabase.from('products').select('id').eq('slug', item.slug).single();
        if (product) {
          await supabase.from('order_items').insert([{
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
          }]);
        }
      }

      const finalOrderId = `WU-${order.id.slice(0, 8).toUpperCase()}`;
      // Save actual intent id for verification
      if(form.paymentMethod === 'online') { await supabase.from('orders').update({ payment_intent_id: finalOrderId }).eq('id', order.id); }
      setOrderId(finalOrderId);

      if (appliedCoupon) {
        await supabase.from('coupon_usages').insert([{
          coupon_id: appliedCoupon.couponId,
          coupon_code: appliedCoupon.code,
          order_id: order.id,
          customer_name: `${form.firstName} ${form.lastName}`.trim(),
          customer_email: form.email,
          order_total: total,
          discount_applied: appliedCoupon.discountAmount,
        }]);
        localStorage.removeItem('appliedCoupon');
      }

      clearCart();
      
      const hasGraphicKits = cart.some((item: any) => item.category === 'graphic-kits');
      if (form.paymentMethod === 'online') {
        const res = await fetch('/api/payment/create-order', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             orderId: finalOrderId,
             orderAmount: total,
             customerDetails: {
               id: user?.id || 'guest',
               name: `${form.firstName} ${form.lastName}`.trim(),
               email: form.email,
               phone: form.phone
             }
           })
        });
        const cfData = await res.json();
        if (cfData.payment_session_id) {
           const cashfree = await load({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox' });
           cashfree.checkout({ paymentSessionId: cfData.payment_session_id, redirectTarget: '_self' });
           return;
        } else {
           throw new Error(cfData.error || 'Failed to initialize payment');
        }
      }

      const adminPhone = hasGraphicKits ? "916296396462" : "919093543071";
      
      let message = `*New Order: ${finalOrderId}*%0A%0A`;
      message += `*Customer:* ${form.firstName} ${form.lastName}%0A`;
      message += `*Phone:* ${form.phone}%0A%0A`;
      message += `*Shipping Address:*%0A${form.address}, ${form.city}, ${form.state} - ${form.pincode}%0A%0A`;
      message += `*Order Items:*%0A`;
      cart.forEach((item, index) => {
         message += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${item.price}%0A`;
      });
      message += `%0A*Total Amount:* ₹${total}%0A`;
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      try {
        console.log('Sending email payload:', {
          email: form.email,
          customerName: form.firstName,
          orderId: finalOrderId,
          totalAmount: total,
          items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        });
        const emailRes = await fetch('/api/emails/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            customerName: form.firstName,
            orderId: finalOrderId,
            totalAmount: total,
            items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          }),
        });
        if (!emailRes.ok) {
          const emailErr = await emailRes.json();
          console.error('Email API Error:', emailErr);
        }
      } catch (err) {
        console.error('Email network error:', err);
      }

      setOrderPlaced(true);
    } catch (err: any) {
      setPlaceError(err.message ?? 'Something went wrong.');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-green-500" />
        </div>
        <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Order Placed</p>
        <h1 className="font-display font-black text-4xl text-white mb-4 uppercase">YOU&apos;RE ALL SET!</h1>
        <p className="text-[#666] mb-8">Order <span className="text-[#E8161B] font-mono font-bold">{orderId}</span> is confirmed. Check your WhatsApp for next steps.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4">Continue Shopping</Link>
          <Link href="/" className="border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-8 py-4">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-4xl text-white mb-4">CART IS EMPTY</h1>
          <Link href="/shop" className="bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4">Shop Now</Link>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Delivery' },
    { key: 'confirm', label: 'Review' },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);
  const inputClass = "w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white placeholder-[#444] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors";
  const labelClass = "font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1 block";

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cart" className="flex items-center gap-2 text-[#666] hover:text-white text-xs font-mono tracking-widest uppercase mb-8 w-fit">
          <ArrowLeft size={12} /> Back to Cart
        </Link>

        <div className="flex items-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 ${i <= stepIndex ? 'bg-[#E8161B]' : 'bg-[#111] border border-[#2a2a2a]'}`}>
                <span className={`font-display font-bold text-xs tracking-widest uppercase ${i <= stepIndex ? 'text-white' : 'text-[#444]'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < stepIndex ? 'bg-[#E8161B]' : 'bg-[#2a2a2a]'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {step === 'address' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">Delivery Details</h2>
                  {savedAddress && (
                    <button 
                      onClick={handleUseSavedAddress}
                      className="flex items-center gap-2 text-[#E8161B] hover:text-white transition-colors font-mono text-[10px] tracking-[0.2em] uppercase border border-[#E8161B]/20 px-3 py-1.5 bg-[#E8161B]/5 hover:bg-[#E8161B]/10"
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
                    <label className={labelClass}>Email Address</label>
                    <input className={inputClass} placeholder="rahul@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Full Shipping Address</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} placeholder="House No, Street, Landmark" value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} placeholder="Bengaluru" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <select className={inputClass} value={form.state} onChange={e => update('state', e.target.value)}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input className={inputClass} placeholder="560001" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                  </div>
                </div>
                <button onClick={() => setStep('confirm')} className="w-full bg-[#E8161B] text-white font-display font-black text-sm tracking-[0.2em] uppercase py-5 hover:bg-[#B81015] transition-all">Review Order &amp; Proceed</button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">Review Order</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-[#111] border border-[#1a1a1a]">
                    <h3 className={labelClass}>Ship To</h3>
                    <p className="font-display font-bold text-white text-sm uppercase">{form.firstName} {form.lastName}</p>
                    <p className="font-body text-[#666] text-xs mt-1">{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                    <p className="font-mono text-[10px] text-[#555] mt-1">{form.phone}</p>
                  </div>
                  <div className="p-5 bg-[#111] border border-[#1a1a1a]">
                    <h3 className={labelClass}>Payment Mode</h3>
                    {hasGraphicKits ? (
                       <div className="flex flex-col gap-2 mt-2">
                         <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                           <input type="radio" name="paymentMethod" value="online" checked={form.paymentMethod === 'online'} onChange={e => update('paymentMethod', e.target.value)} className="accent-[#E8161B]" />
                           Pay Online (Cashfree)
                         </label>
                         <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                           <input type="radio" name="paymentMethod" value="whatsapp" checked={form.paymentMethod === 'whatsapp'} onChange={e => update('paymentMethod', e.target.value)} className="accent-[#E8161B]" />
                           WhatsApp Order (Manual/COD)
                         </label>
                       </div>
                    ) : (
                      <>
                        <p className="font-display font-bold text-white text-sm uppercase">WhatsApp Order</p>
                        <p className="font-body text-[#666] text-xs mt-1">Order will be processed via WhatsApp</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center p-3 bg-[#111] border border-[#1a1a1a]">
                      <div className="relative w-14 h-14 bg-[#181818]">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover opacity-80" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-xs text-white uppercase tracking-wider">{item.name}</p>
                        <p className="font-mono text-[10px] text-[#555]">QTY: {item.quantity}</p>
                      </div>
                      <span className="font-display font-bold text-sm text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {placeError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] text-center">{placeError}</div>}

                <div className="flex gap-4">
                  <button onClick={() => setStep('address')} className="px-6 py-5 border border-[#2a2a2a] text-[#555] font-display font-bold text-[10px] tracking-widest uppercase hover:text-white transition-colors">Edit</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="flex-1 bg-[#E8161B] text-white font-display font-black text-sm tracking-[0.2em] uppercase py-5 hover:bg-[#B81015] transition-all disabled:opacity-50">
                    {placing ? 'Placing Order...' : `Place Order ${form.paymentMethod === 'online' ? 'Online' : 'via WhatsApp'} · ${formatPrice(total)}`}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center"><span className="text-white font-mono text-sm">Loading checkout...</span></div>}>
      <CheckoutInner />
    </Suspense>
  );
}
