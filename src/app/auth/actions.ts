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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const getBaseURL = () => {
    // Use dynamic request headers to determine the exact origin of the user
    // This fixes the issue where local testing gets hijacked by .env prod variables
    try {
      const headersList = headers();
      const host = headersList.get('host');
      const protocol = headersList.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
      if (host) return `${protocol}://${host}`;
    } catch (e) {
      // Ignore if headers() is unavailable
    }

    // Fallback logic
    let url = process.env.NEXT_PUBLIC_SITE_URL 
      ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
      ?? process.env.NEXT_PUBLIC_VERCEL_URL 
      ?? process.env.VERCEL_URL 
      ?? 'http://localhost:3000';
      
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
    redirect(data.url); // Use the URL provided by Supabase
  }

  return { success: true };
}
