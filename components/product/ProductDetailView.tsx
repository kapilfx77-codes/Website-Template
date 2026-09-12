'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';

export default function ProductDetailView({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const price = Number(product.price ?? 0);
  const compare = product.compare_at_price ? Number(product.compare_at_price) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
        <div className="rounded-2xl bg-[#F0EEED] overflow-hidden shadow-lg">
          <img src={product.image_urls?.[0] || '/placeholder.svg'} alt={product.name} className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-5">
        <span className="inline-flex w-fit rounded-full bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1">IN STOCK</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-extrabold">★★★★★</span><span className="text-slate-500">4.8 (128 reviews)</span></div>
        <div className="flex items-end gap-3 mt-2">
          <span className="text-4xl md:text-5xl font-black text-black">${(price/100).toFixed(2)}</span>
          {compare && compare > price && <span className="text-xl text-slate-400 line-through">${(compare/100).toFixed(2)}</span>}
          <span className="ml-2 inline-block rounded-full bg-red-50 text-red-600 text-xs font-extrabold px-2.5 py-1">-20%</span>
        </div>
        <p className="text-base text-slate-600 leading-relaxed">{product.description || 'Premium quality item.'}</p>
        <div className="flex items-center gap-3 mt-1">
          <button onClick={() => setQty(Math.max(1, qty-1))} className="rounded-full border border-slate-300 h-10 w-10 flex items-center justify-center hover:bg-black hover:text-white transition"><Minus className="h-4 w-4"/></button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button onClick={() => setQty(qty+1)} className="rounded-full border border-slate-300 h-10 w-10 flex items-center justify-center hover:bg-black hover:text-white transition"><Plus className="h-4 w-4"/></button>
        </div>
        <button onClick={() => { addItem({ id: product.id, slug: product.slug, title: product.name, price, image: product.image_urls?.[0]||'', quantity: qty }); }} className="w-full rounded-full bg-black text-white text-lg font-bold py-4 hover:bg-neutral-800 transition">Add to Cart</button>
      </motion.div>
    </div>
  );
}
