import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Products } from '@/types/supabase';
import { siteConfig } from '@/config/site';
import { formatCurrency } from '@/lib/store/useCart';
import PdpActions from '@/components/storefront/PdpActions';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error || !product) notFound();

  const p = product as Products & { categories?: { name?: string; slug?: string } | null };
  const price = Number(p.price);
  const image = p.image_urls?.[0] || '';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 text-sm text-muted-foreground">
            <a href="/" className="hover:underline">Home</a>
            {' > '}
            <a href="/store" className="hover:underline">Store</a>
            {' > '}
            <span className="text-foreground">{p.name}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {image ? <img src={image} alt={p.name} className="h-full w-full object-cover" /> : <div className="flex h-96 items-center justify-center text-slate-400">No image</div>}
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{p.name}</h1>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-blue-700">{formatCurrency(price)}</span>
                {p.compare_at_price && Number(p.compare_at_price) > price && (
                  <span className="text-lg text-slate-400 line-through">{formatCurrency(Number(p.compare_at_price))}</span>
                )}
              </div>
              <div className="mt-8 flex gap-3">
                <PdpActions product={{ id: p.id, slug: p.slug as string, title: p.name, price, image }} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
