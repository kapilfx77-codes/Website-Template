import React from 'react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ProductGrid from '@/components/storefront/ProductGrid';
import BentoCategories from '@/components/BentoCategories';
import Reviews from '@/components/Reviews';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: productsData } = await supabase
    .from('products')
    .select('id, name, slug, price, image_urls, category_id, is_active')
    .eq('is_active', true)
    .limit(4);

  const products = (productsData || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    image: p.image_urls?.[0] || '',
    category_id: p.category_id,
  }));

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-10 pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-black mb-8">
              FIND CLOTHING<br />THAT MATCHES YOUR STYLE
            </h1>
            <Link href="/store" className="inline-flex items-center gap-2 rounded-full bg-black text-white text-base md:text-xl font-medium px-12 py-4 hover:bg-neutral-800 transition shadow-xl">
              Shop Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto border-t border-neutral-200 pt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold">200+</div>
              <div className="text-xs md:text-sm text-neutral-500 font-medium">International Brands</div>
            </div>
            <div className="text-center border-l border-neutral-200">
              <div className="text-2xl md:text-3xl font-extrabold">2,000+</div>
              <div className="text-xs md:text-sm text-neutral-500 font-medium">High-Quality Products</div>
            </div>
            <div className="text-center border-l border-neutral-200">
              <div className="text-2xl md:text-3xl font-extrabold">30,000+</div>
              <div className="text-xs md:text-sm text-neutral-500 font-medium">Happy Customers</div>
            </div>
          </div>
        </section>

        {/* Brand Marquee */}
        <section id="brands" className="bg-black py-10 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-90">
            {['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'CALVIN KLEIN'].map((brand) => (
              <span key={brand} className="text-white text-xl md:text-3xl font-black tracking-tighter uppercase whitespace-nowrap">{brand}</span>
            ))}
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section id="new-arrivals" className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
          <h2 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-12">NEW ARRIVALS</h2>
          <ProductGrid products={products.map((p: any) => ({ ...p, rating: 4.5, discount: 20 }))} />
          <div className="flex justify-center mt-12">
            <Link href="/store" className="rounded-full border-2 border-black text-black font-bold px-10 py-3 hover:bg-black hover:text-white transition">View All</Link>
          </div>
        </section>

        {/* On Sale */}
        <section id="on-sale" className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
          <h2 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-12">ON SALE</h2>
          <ProductGrid products={products.map((p: any) => ({ ...p, rating: 4.5, discount: 30 }))} />
        </section>

        {/* Browse by Dress Style */}
        <BentoCategories />

        {/* TOP SELLING */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
          <h2 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-12">TOP SELLING</h2>
          <ProductGrid products={products.map((p: any) => ({ ...p, rating: 4.8, discount: 15 }))} />
          <div className="flex justify-center mt-12">
            <Link href="/store" className="rounded-full border-2 border-black text-black font-bold px-10 py-3 hover:bg-black hover:text-white transition">View All</Link>
          </div>
        </section>

        {/* Reviews */}
        <Reviews />
      </main>

      <Footer />
    </div>
  );
}
