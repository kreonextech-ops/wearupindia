import { NextRequest, NextResponse } from 'next/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';

// Use the service-role-free anon key directly — this is a public validation endpoint
// The table RLS allows anon reads on coupons
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, cartTotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code.' }, { status: 400 });
    }

    if (typeof cartTotal !== 'number' || cartTotal <= 0) {
      return NextResponse.json({ valid: false, error: 'Invalid cart total.' }, { status: 400 });
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, discount_type, discount_value, expiry_date, usage_limit, times_used, is_active, influencer_name')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('Coupon lookup error:', error.message);
      return NextResponse.json({ valid: false, error: 'Server error. Please try again.' }, { status: 500 });
    }

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Coupon code not found.' }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active.' }, { status: 400 });
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired.' }, { status: 400 });
    }

    if (coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit.' }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = Math.round((cartTotal * coupon.discount_value) / 100);
    } else {
      // Flat discount — cap at cart total so we never go negative
      discountAmount = Math.min(coupon.discount_value, cartTotal);
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount,
      influencerName: coupon.influencer_name,
    });
  } catch (err: any) {
    console.error('Coupon validate error:', err);
    return NextResponse.json({ valid: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
