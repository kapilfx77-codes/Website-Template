import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Products } from '@/types/supabase';
import ProductDetailView from '@/components/product/ProductDetailView';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

interface PageProps { params: Promise<{ slug: string }>; }

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase.from('products').select('*, categories(name, slug)').eq('slug', slug).eq('is_active', true).single();
  if (error || !product) notFound();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 text-sm text-muted-foreground">Home {'>'} Store {'>'} <span className="text-foreground">{product.name}</span></nav>
          <ProductDetailView product={product} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
