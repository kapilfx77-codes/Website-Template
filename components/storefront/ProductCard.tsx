/**
 * ProductCard — Card with thumbnail, title, category badge, price, stock badge, and add-to-cart.
 *
 * Uses formatCurrency from lib/store/useCart and siteConfig for localization.
 */

'use client';

import React from 'react';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/store/useCart';
import { useCart } from '@/lib/store/useCart';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number; // in cents
  image: string;
  category?: string;
  stock: number;
  slug?: string;
  options?: Record<string, any>;
}

export function ProductCard({ id, title, price, image, category, stock, slug, options }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    addItem({
      id,
      title,
      price,
      image,
      quantity: 1,
      options,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70">
      {/* Image */}
      <a href={slug ? `/store/${slug}` : `/store`} className="relative block overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow backdrop-blur">
            {category}
          </span>
        )}
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          <a href={slug ? `/store/${slug}` : `/store`} className="hover:underline hover:text-blue-600">{title}</a>
        </h3>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-xl font-extrabold text-slate-900">{formatCurrency(price)}</span>
          <span className="text-xs text-slate-400">per item</span>
        </div>

        {/* Stock badge */}
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
          {stock > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-green-700"><CheckCircle className="h-3 w-3" /> In Stock</span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-red-700"><XCircle className="h-3 w-3" /> Out of Stock</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={stock <= 0 || added}
          className={cn(
            'mt-4 w-full rounded-lg py-2.5 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300',
            added
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-slate-900 text-white hover:bg-slate-800',
            stock <= 0 && 'cursor-not-allowed bg-slate-300 text-slate-500 hover:bg-slate-300'
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {added ? 'Added!' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </article>
  );
}
