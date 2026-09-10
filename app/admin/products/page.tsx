import { createClient } from '@/lib/supabase/server';
import { Categories, Products } from '@/types/supabase';
import AdminProductsClient from './page-client';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name'),
  ]);

  const products = (productsData || []) as Products[];
  const categories = (categoriesData || []) as Categories[];

  return <AdminProductsClient products={products} categories={categories} />;
}
