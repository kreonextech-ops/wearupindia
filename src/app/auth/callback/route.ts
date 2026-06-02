import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Use the canonical site URL to avoid redirecting to localhost:3000 in production.
// `origin` from request.url can resolve to the internal server address.
function getSiteURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL ??
    'https://wearupindia.com';
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url.slice(0, -1) : url;
  return url;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    // Determine the correct base URL for post-auth redirect.
    // Prefer x-forwarded-host so Vercel preview URLs work correctly too.
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
    const baseURL = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : getSiteURL();

    if (code) {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(`${baseURL}${next}`);
      } else {
        console.error('Supabase exchange error:', error);
        return NextResponse.json({ error: 'Supabase exchange failed', details: error.message }, { status: 400 });
      }
    }

    // No code present
    return NextResponse.redirect(`${baseURL}/auth/auth-code-error`);
  } catch (err: any) {
    console.error('Fatal callback error:', err);
    return NextResponse.json({ 
      error: 'Fatal callback crash', 
      message: err.message, 
      stack: err.stack 
    }, { status: 500 });
  }
}
