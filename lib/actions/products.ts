'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/service';
import { Products, InsertProducts } from '@/types/supabase';

export async function createProduct(formData: FormData) {
  const supabase = createClient();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  const price = Number(formData.get('price'));
  const sku = (formData.get('sku') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;
  const image_urls = formData.get('image_urls') ? (formData.get('image_urls') as string).split(',').map(s => s.trim()).filter(Boolean) : [];
  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  const insert: InsertProducts = {
    name,
    slug,
    price,
    sku: sku || undefined,
    category_id: category_id || undefined,
    image_urls,
    is_active,
  };

  try {
    const { error } = await supabase.from('products').insert(insert);
    if (error) throw new Error(error.message);
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    console.error('createProduct error:', e);
    return { success: false, error: e?.message || String(e) };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient();
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const sku = (formData.get('sku') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;
  const image_urls = formData.get('image_urls') ? (formData.get('image_urls') as string).split(',').map(s => s.trim()).filter(Boolean) : undefined;
  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  try {
    const { error } = await supabase.from('products').update({
      name,
      price,
      sku: sku || undefined,
      category_id: category_id || undefined,
      ...(image_urls !== undefined ? { image_urls } : {}),
      is_active,
    }).eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    console.error('updateProduct error:', e);
    return { success: false, error: e?.message || String(e) };
  }
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    console.error('deleteProduct error:', e);
    return { success: false, error: e?.message || String(e) };
  }
}

export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const name = formData.get('name') as string;
  let slug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!slug) {
    slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }
  // Ensure uniqueness by appending timestamp if duplicate slug pattern detected
  const { data: existingCat } = await supabase.from('categories').select('id').eq('slug', slug).single();
  if (existingCat) {
    slug = slug + '-' + Date.now();
  }

  try {
    const { error } = await supabase.from('categories').insert({ name, slug, is_active: true, sort_order: 0 });
    if (error) throw new Error(error.message);
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    console.error('createCategory error:', e);
    return { success: false, error: e?.message || String(e) };
  }
}
