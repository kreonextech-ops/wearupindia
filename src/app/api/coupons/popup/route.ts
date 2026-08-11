import { NextResponse } from 'next/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';

// Use the service-role-free anon key directly
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('code, discount_type, discount_value')
      .eq('show_in_popup', true)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Coupon popup lookup error:', error.message);
      return NextResponse.json({ active: false }, { status: 500 });
    }

    if (!coupon) {
      return NextResponse.json({ active: false });
    }

    return NextResponse.json({
      active: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
    });
  } catch (err: any) {
    console.error('Coupon popup error:', err);
    return NextResponse.json({ active: false }, { status: 500 });
  }
}
