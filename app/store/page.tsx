import { createClient } from '@/lib/supabase/server';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ProductGrid from '@/components/storefront/ProductGrid';
import { siteConfig } from '@/config/site';

export default async function StorePage() {
  const supabase = await createClient();
  const { data: productsData } = await supabase
    .from('products')
    .select('id, name, slug, price, image_urls, category_id, is_active')
    .eq('is_active', true);

  const products = (productsData || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    image: p.image_urls?.[0] || '',
    category: 'Product',
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 pt-6">All Products</h1>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  );
}
