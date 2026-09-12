'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../storefront/ProductCard';

export default function ProductRecommendations({
  currentId,
  categorySlug,
  currentSlug,
}: {
  currentId?: string;
  categorySlug?: string;
  currentSlug?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      let list: any[] = [];
      try {
        // Try same category first
        const catRes = await fetch(`/api/products?category=${encodeURIComponent(categorySlug || '')}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          list = (catData.products || []).filter((p: any) => p.id !== currentId && p.slug !== currentSlug);
        }
      } catch {}
      // Backfill with featured / random if < 4
      if (list.length < 4) {
        try {
          const featRes = await fetch(`/api/products?featured=true`);
          if (featRes.ok) {
            const featData = await featRes.json();
            const extras = (featData.products || []).filter((p: any) => p.id !== currentId && p.slug !== currentSlug && !list.find((x) => x.id === p.id));
            list = [...list, ...extras].slice(0, 4);
          }
        } catch {}
      }
      if (list.length < 4) {
        try {
          const allRes = await fetch(`/api/products`);
          if (allRes.ok) {
            const allData = await allRes.json();
            const extras = (allData.products || []).filter((p: any) => p.id !== currentId && p.slug !== currentSlug && !list.find((x) => x.id === p.id));
            list = [...list, ...extras].slice(0, 4);
          }
        } catch {}
      }
      setItems(list.slice(0, 4));
    }
    load();
  }, [currentId, categorySlug, currentSlug]);

  if (items.length === 0) return null;
  return (
    <section className="pt-12" aria-label="Related products">
      <h2 className="text-2xl font-extrabold tracking-tight text-black mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard
            key={p.id || p.slug}
            id={p.id}
            slug={p.slug}
            title={p.name || p.title}
            price={p.price}
            compareAtPrice={p.compare_at_price || null}
            image={p.image_urls?.[0] || p.image || '/placeholder.svg'}
            rating={p.rating || 4.5}
            category={p.category?.name || p.categories?.name || ''}
            discount={p.discount || 0}
          />
        ))}
      </div>
    </section>
  );
}
