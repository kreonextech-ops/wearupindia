'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
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
