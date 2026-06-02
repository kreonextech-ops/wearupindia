'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signUpAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // If email confirmation is off, the user might be signed in immediately.
  // We'll redirect to login after signup to be safe.
  return { success: true };
}

export async function signOutAction() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function signInWithGoogle() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const getBaseURL = () => {
      try {
        const headersList = headers();
        // x-forwarded-host is the most reliable header on Vercel for the public hostname.
        // It correctly reflects preview URLs like wearupindia.vercel.app.
        const forwardedHost = headersList.get('x-forwarded-host');
        const forwardedProto = headersList.get('x-forwarded-proto') ?? 'https';
        if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

        // Fallback: try host header (works on localhost)
        const host = headersList.get('host');
        if (host) {
          const protocol = host.includes('localhost') ? 'http' : 'https';
          return `${protocol}://${host}`;
        }
      } catch (e) {
        // Ignore header read errors
      }

      // Last resort: use the configured site URL env var
      let url = process.env.NEXT_PUBLIC_SITE_URL 
        ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
        ?? process.env.NEXT_PUBLIC_VERCEL_URL 
        ?? process.env.VERCEL_URL 
        ?? 'https://wearupindia.com';
        
      url = url.startsWith('http') ? url : `https://${url}`;
      url = url.endsWith('/') ? url.slice(0, -1) : url;
      return url;
    };

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getBaseURL()}/auth/callback`,
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      return { success: false, error: error.message };
    }

    if (data?.url) {
      redirect(data.url);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Fatal signInWithGoogle error:', err);
    // Important: if err is a NEXT_REDIRECT error, we must rethrow it so Next.js handles the redirect!
    if (err?.message === 'NEXT_REDIRECT') {
      throw err;
    }
    return { success: false, error: `Fatal crash: ${err.message}` };
  }
}
