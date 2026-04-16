'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const full_name = formData.get('full_name') as string;
  const phone_number = formData.get('phone_number') as string;

  // Use UPSERT so this works even if no profile row exists yet for this user
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,           // ensures this is THEIR profile, no mixing
      email: user.email,
      full_name,
      phone_number,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function updateAddressAction(addressData: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Use UPSERT so this works even if no profile row exists yet for this user
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,           // ensures this is THEIR profile, no mixing
      email: user.email,
      shipping_address: addressData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('Update address error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}
