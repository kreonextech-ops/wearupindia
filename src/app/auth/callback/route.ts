import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams, origin } = url;
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error('Supabase exchange error:', error);
        return NextResponse.json({ error: 'Supabase exchange failed', details: error.message }, { status: 400 });
      }
    }

    // No code present
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (err: any) {
    console.error('Fatal callback error:', err);
    return NextResponse.json({ 
      error: 'Fatal callback crash', 
      message: err.message, 
      stack: err.stack 
    }, { status: 500 });
  }
}
