'use client';
import React from 'react';
import { Star } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';

export interface ProductCardProps {
  id?: string;
  slug?: string;
  title?: string;
  price?: number;
  compareAtPrice?: number | null;
  image?: string;
  rating?: number;
  category?: string;
  discount?: number;
}

export default function ProductCard({
  id = '',
  slug = '',
  title = '',
  price = 0,
  compareAtPrice = null,
  image = '',
  rating = 4.5,
  category = '',
  discount = 0,
}: ProductCardProps) {
  const addItem = useCart((s: any) => s.addItem);

  const currentPrice = price ?? 0;
  const originalPrice = compareAtPrice && compareAtPrice > currentPrice ? compareAtPrice : null;

  return (
    <article className="group flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-red-50 text-red-500 text-xs font-extrabold px-3 py-1 rounded-full">-{discount}%</span>
        )}
        <a href={slug ? `/store/${slug}` : '#'} className="block h-full w-full">
          <img
            src={image || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </a>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        {category && <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{category}</span>}
        <h3 className="text-base font-medium leading-snug text-black line-clamp-2">
          <a href={slug ? `/store/${slug}` : '#'} className="hover:text-neutral-600 transition">{title}</a>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex text-[#FFC107]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
          <span className="text-neutral-500 font-medium">{rating}/5</span>
        </div>

        {/* Price Block */}
        <div className="flex items-center gap-2.5 mt-0.5">
          <span className="text-lg font-extrabold text-black">${currentPrice}</span>
          {originalPrice && (
            <span className="text-sm text-neutral-400 line-through">${originalPrice}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addItem({ id, slug, title, price: currentPrice, image })}
          className="mt-1 w-full rounded-full bg-black text-white text-sm font-bold py-3 hover:bg-neutral-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
