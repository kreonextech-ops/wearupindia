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

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name, 
      phone_number,
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id);

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

  const { error } = await supabase
    .from('profiles')
    .update({ 
      shipping_address: addressData,
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id);

  if (error) {
    console.error('Update address error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}
