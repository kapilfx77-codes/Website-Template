import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getJwtRole(token?: string) {
  if (!token) return 'missing';
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded.role || 'unknown';
  } catch {
    return 'invalid_jwt';
  }
}

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const keyRole = getJwtRole(serviceKey);

  if (keyRole !== 'service_role') {
    return NextResponse.json({
      error: `KEY ROLE MISMATCH: Vercel is using a key with role "${keyRole}". It MUST be "service_role".`,
      keyRole,
    }, { status: 500 });
  }

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY or URL is missing from environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    const { data: categories } = await supabase.from('categories').select('id');
    const { data: products } = await supabase.from('products').select('id');
    const hasData = (categories && categories.length > 0) || (products && products.length > 0);

    if (!hasData) {
      const categoriesToInsert = [
        { name: 'Electronics', slug: 'electronics', is_active: true, sort_order: 1 },
        { name: 'Clothing', slug: 'clothing', is_active: true, sort_order: 2 },
        { name: 'Accessories', slug: 'accessories', is_active: true, sort_order: 3 },
        { name: 'Food & Drinks', slug: 'food-drinks', is_active: true, sort_order: 4 },
      ];
      const { data: insertedCats, error: catErr } = await supabase.from('categories').insert(categoriesToInsert).select();
      if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 });

      const electronicsId = insertedCats?.find((c: any) => c.slug === 'electronics')?.id || insertedCats?.[0]?.id;
      const clothingId = insertedCats?.find((c: any) => c.slug === 'clothing')?.id || insertedCats?.[1]?.id;
      const accessoriesId = insertedCats?.find((c: any) => c.slug === 'accessories')?.id || insertedCats?.[2]?.id;
      const foodId = insertedCats?.find((c: any) => c.slug === 'food-drinks')?.id || insertedCats?.[3]?.id;

      const productsToInsert = [
        { name: 'Wireless Earbuds', slug: 'wireless-earbuds', price: 4999, sku: 'WB-001', category_id: electronicsId, image_urls: ['https://images.unsplash.com/photo-1572569025664-69c0772848d3?w=600&h=400&fit=crop'], is_active: true, is_featured: true },
        { name: 'Premium Hoodie', slug: 'premium-hoodie', price: 3499, sku: 'CL-001', category_id: clothingId, image_urls: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop'], is_active: true },
        { name: 'Leather Wallet', slug: 'leather-wallet', price: 1999, sku: 'AC-001', category_id: accessoriesId, image_urls: ['https://images.unsplash.com/photo-1627123423443-48fc1d076b79?w=600&h=400&fit=crop'], is_active: true },
        { name: 'Organic Coffee Beans', slug: 'organic-coffee-beans', price: 1299, sku: 'FD-001', category_id: foodId, image_urls: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop'], is_active: true },
        { name: 'Smart Watch', slug: 'smart-watch', price: 8999, sku: 'WB-002', category_id: electronicsId, image_urls: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=400&fit=crop'], is_active: true, is_featured: true },
        { name: 'Running Shoes', slug: 'running-shoes', price: 5999, sku: 'CL-002', category_id: clothingId, image_urls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop'], is_active: true },
      ];
      const { error: prodErr } = await supabase.from('products').insert(productsToInsert);
      if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 });
      return NextResponse.json({ success: true, message: 'Database seeded successfully', seeded: true });
    }

    return NextResponse.json({ message: 'Data already exists.', seeded: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
