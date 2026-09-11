import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Products } from '@/types/supabase';
import { siteConfig } from '@/config/site';
import { formatCurrency } from '@/lib/store/useCart';

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

  if (error || !product) {
    notFound();
  }

  const p = product as Products & { categories?: { name?: string; slug?: string } | null };

  const price = Number(p.price);
  const image = p.image_urls?.[0] || '';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 text-sm text-muted-foreground">
            <a href="/" className="hover:underline">Home</a>
            {' > '}
            <a href="/store" className="hover:underline">Store</a>
            {' > '}
            {p.categories?.name && (
              <>
                <a href={`/?category=${p.categories.slug || ''}`} className="hover:underline">{p.categories.name}</a>
                {' > '}
              </>
            )}
            <span className="text-foreground">{p.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {image ? (
                <img
                  src={image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-96 items-center justify-center text-slate-400">
                  No image available
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {p.categories?.name && (
                <span className="mb-2 inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                  {p.categories.name}
                </span>
              )}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{p.name}</h1>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-blue-700">{formatCurrency(price)}</span>
                {p.compare_at_price && Number(p.compare_at_price) > price && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(Number(p.compare_at_price))}
                  </span>
                )}
              </div>

              {p.sku && (
                <p className="mt-2 text-sm text-slate-500">
                  SKU: <span className="font-mono text-slate-700">{p.sku}</span>
                </p>
              )}

              <div className="mt-6 border-t border-slate-200 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</h2>
                <p className="mt-2 text-base leading-relaxed text-slate-700">
                  {p.description || 'No description available for this product.'}
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <a href="/cart" className="inline-flex items-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-800">Add to Cart</a>
                <a href="/cart" className="inline-flex items-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow hover:bg-amber-600">Buy Now</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}