import { createServerClient } from '@/lib/supabase/server';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CategoryFilter from '@/components/storefront/CategoryFilter';
import ProductGrid from '@/components/storefront/ProductGrid';
import CartDrawer from '@/components/cart/CartDrawer';
import { siteConfig } from '@/config/site';

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function StorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category || null;
  const searchQuery = params?.search || null;

  const supabase = await createServerClient();

  const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
    supabase.from('categories').select('id, name, slug, is_active').eq('is_active', true).order('name'),
    supabase.from('products').select('id, name, slug, price, image_urls, category_id, sku, is_active').eq('is_active', true),
  ]);

  let products = (productsData || []);
  if (selectedCategory) {
    products = products.filter((p: any) => p.category_id === selectedCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter((p: any) =>
      (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)
    );
  }

  const categories = (categoriesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <CartDrawer />

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{siteConfig.name}</h1>
          <p className="text-muted-foreground text-lg">{siteConfig.description}</p>
        </section>

        <div className="mb-8">
          <CategoryFilter categories={categories || []} selectedCategory={selectedCategory} />
        </div>

        <ProductGrid products={products || []} />
      </main>

      <Footer />
    </div>
  );
}
