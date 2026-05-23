const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/checkout/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add imports
content = content.replace(
  "import { useStore } from '@/lib/store-context';",
  "import { useStore } from '@/lib/store-context';\nimport { useSearchParams, useRouter } from 'next/navigation';\nimport { load } from '@cashfreepayments/cashfree-js';"
);

// 2. Add hooks to CheckoutPage
content = content.replace(
  "const { cart, cartTotal, clearCart } = useStore();",
  "const { cart, cartTotal, clearCart } = useStore();\n  const searchParams = useSearchParams();\n  const router = useRouter();"
);

// 3. Add verifyPayment effect
content = content.replace(
  "const [savedAddress, setSavedAddress] = useState<any>(null);",
  `const [savedAddress, setSavedAddress] = useState<any>(null);

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
      router.replace('/checkout');
    }
  };`
);

// 4. Update form default
content = content.replace(
  "paymentMethod: 'whatsapp',",
  "paymentMethod: 'online'," // default to online
);

// 5. Check hasGraphicKits early
content = content.replace(
  "const total = cartTotal + shipping - couponDiscount;",
  "const total = cartTotal + shipping - couponDiscount;\n  const hasGraphicKits = cart.some((item: any) => item.category === 'graphic-kits' || item.slug?.includes('graphic-kit'));"
);

// 6. Inside handlePlaceOrder, change payment intent insertion based on method
content = content.replace(
  "payment_intent_id: 'whatsapp',",
  "payment_intent_id: form.paymentMethod === 'online' ? 'cashfree' : 'whatsapp',"
);

// 7. Update finalOrderId before coupon insertion so we can use it
content = content.replace(
  "const finalOrderId = `WU-\${order.id.slice(0, 8).toUpperCase()}`;",
  "const finalOrderId = `WU-\${order.id.slice(0, 8).toUpperCase()}`;\n      // Save actual intent id for verification\n      if(form.paymentMethod === 'online') { await supabase.from('orders').update({ payment_intent_id: finalOrderId }).eq('id', order.id); }"
);

// 8. Add cashfree logic in place of whatsapp logic
const targetLogic = `const adminPhone = hasGraphicKits ? "916296396462" : "919093543071";`;
const replacementLogic = `if (form.paymentMethod === 'online') {
        const res = await fetch('/api/payment/create-order', {
           method: 'POST',
           body: JSON.stringify({
             orderId: finalOrderId,
             orderAmount: total,
             customerDetails: {
               id: user?.id || 'guest',
               name: \`\${form.firstName} \${form.lastName}\`.trim(),
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

      const adminPhone = hasGraphicKits ? "916296396462" : "919093543071";`;
content = content.replace(targetLogic, replacementLogic);

// 9. Update Payment Mode UI
const targetUI = `<div className="p-5 bg-[#111] border border-[#1a1a1a]">
                    <h3 className={labelClass}>Payment Mode</h3>
                    <p className="font-display font-bold text-white text-sm uppercase">WhatsApp Order</p>
                    <p className="font-body text-[#666] text-xs mt-1">Order will be processed via WhatsApp</p>
                  </div>`;
const replacementUI = `<div className="p-5 bg-[#111] border border-[#1a1a1a]">
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
                  </div>`;
content = content.replace(targetUI, replacementUI);

// 10. Update Place Order button text
content = content.replace(
  "{placing ? 'Placing Order...' : `Place Order via WhatsApp · \${formatPrice(total)}`}",
  "{placing ? 'Placing Order...' : `Place Order \${form.paymentMethod === 'online' ? 'Online' : 'via WhatsApp'} · \${formatPrice(total)}`}"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated checkout/page.tsx");
