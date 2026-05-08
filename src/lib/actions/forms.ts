'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type FormSubmission = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  type: 'contact' | 'bulk_order' | 'service_inquiry';
  metadata?: any;
};

export async function submitFormAction(data: FormSubmission) {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('form_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          type: data.type,
          metadata: data.metadata || {},
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Error submitting form:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the admin requests page if it exists
    revalidatePath('/admin/form-requests');
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error during form submission:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function getAllSubmissionsAction() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Error fetching submissions:', err);
    return { success: false, error: err.message };
  }
}

export async function updateSubmissionStatusAction(id: string, status: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('form_submissions')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/form-requests');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating submission:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteSubmissionAction(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/form-requests');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting submission:', err);
    return { success: false, error: err.message };
  }
}
