'use client';
import { useCart } from '@/lib/store/useCart';
import { useState, useEffect } from 'react';

export default function PdpActions({ product }: { product: { id: string; slug: string; title: string; price: number; image: string } }) {
  const addItem = useCart((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="flex gap-3"><div className="h-12 w-40 rounded-lg bg-slate-200 animate-pulse"/><div className="h-12 w-40 rounded-lg bg-amber-200 animate-pulse"/></div>;
  return (
    <div className="flex gap-3">
      <button onClick={() => addItem({ ...product, quantity: 1 })} className="inline-flex items-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-800">Add to Cart</button>
      <button onClick={() => { addItem({ ...product, quantity: 1 }); setTimeout(() => { window.location.href = '/cart'; }, 150); }} className="inline-flex items-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow hover:bg-amber-600">Buy Now</button>
    </div>
  );
}
