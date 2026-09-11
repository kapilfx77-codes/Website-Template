import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  const price = Number(product.price);
  const compare = product.compare_at_price ? Number(product.compare_at_price) : undefined;
  const discount = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  return (
    <div className="group relative bg-paper rounded-[20px] p-3 overflow-hidden">
      <Link href={`/store/${product.slug}`} className="block relative aspect-square rounded-[20px] overflow-hidden bg-neutral-100">
        <img src={product.image || '/placeholder-product.png'} alt={product.title || product.name} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition duration-500" />
      </Link>
      <div className="mt-3 px-1 pb-1">
        <h3 className="font-medium text-base text-neutral-900 truncate">{product.title || product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold">4.5/5</span>
          <span className="text-xs text-neutral-400">(120)</span>
        </div>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-lg font-extrabold">${(price / 100).toFixed(2)}</span>
          {compare && (
            <>
              <span className="text-sm text-neutral-400 line-through">${(compare / 100).toFixed(2)}</span>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-{discount}%</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            // Zustand add
            const { useCart } = require('@/lib/store/useCart');
            useCart.getState().addItem({ id: product.id, title: product.title || product.name, price, image: product.image || '' });
          }}
          className="mt-3 w-full rounded-full bg-black text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition"
        >Add to Cart</button>
      </div>
    </div>
  );
}
