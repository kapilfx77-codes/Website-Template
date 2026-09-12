import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Products } from '@/types/supabase';
import { formatCurrency } from '@/lib/store/useCart';
import { motion } from 'framer-motion';
import PdpActions from '@/components/storefront/PdpActions';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

interface PageProps { params: Promise<{ slug: string }>; }

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products').select('*, categories(name, slug)').eq('slug', slug).eq('is_active', true).single();
  if (error || !product) notFound();
  const p = product as Products & { categories?: { name?: string; slug?: string } | null };
  const price = Number(p.price);
  const image = p.image_urls?.[0] || '';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 text-sm text-muted-foreground">Home {'>'} Store {'>'} <span className="text-foreground">{p.name}</span></nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Left: Image gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
              <div className="rounded-2xl bg-[#F0EEED] overflow-hidden shadow-lg hover:shadow-2xl transition">
                <img src={image} alt={p.name} className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500" />
              </div>
            </motion.div>

            {/* Right: Buy Box */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-5">
              <span className="inline-flex w-fit rounded-full bg-green-100 text-green-700 text-xs font-extrabold px-4 py-1">IN STOCK</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">{p.name}</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-500 font-extrabold">★★★★★</span>
                <span className="text-slate-500">4.8 (128 reviews)</span>
              </div>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-4xl md:text-5xl font-black text-black">{formatCurrency(price)}</span>
                {p.compare_at_price && Number(p.compare_at_price) > price && (
                  <span className="text-xl text-slate-400 line-through">{formatCurrency(Number(p.compare_at_price))}</span>
                )}
                <span className="ml-2 inline-block rounded-full bg-red-50 text-red-600 text-xs font-extrabold px-2.5 py-1">-20%</span>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">{p.description || 'Premium quality item delivered with style and value.'}</p>

              {/* Swatches */}
              <div className="flex gap-3 mt-1">
                {['#1a1a1a','#c4a882','#f5f5f5'].map(c => <button key={c} className="h-8 w-8 rounded-full border-2 border-slate-200 hover:scale-110 transition ring-offset-2 focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: c }} aria-label={`Color ${c}`} />)}
              </div>
              <div className="flex gap-3 mt-1">
                {['S','M','L','XL'].map(s => <button key={s} className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-bold hover:border-black hover:bg-black hover:text-white transition">{s}</button>)}
              </div>

              <div className="mt-2">
                <PdpActions product={{ id: p.id, slug: p.slug as string, title: p.name, price, image }} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
