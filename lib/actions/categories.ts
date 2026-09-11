'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/service';

export async function deleteCategory(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || String(e) };
  }
}
