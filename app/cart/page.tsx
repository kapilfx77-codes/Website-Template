'use client';
import { useCart, formatCurrency } from '@/lib/store/useCart';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, isOpen, updateQuantity, removeItem, getSubtotal, getTotal, toggleCart, openCart, closeCart } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">Your Cart</h1>
          <Link href="/" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Continue Shopping</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 flex-1 w-full">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border shadow-xl p-16 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">Add some products and come back.</p>
            <Link href="/" className="mt-6 inline-block rounded-xl bg-blue-700 px-6 py-3 text-sm font-extrabold text-white">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <ul className="divide-y divide-slate-100 bg-white rounded-2xl border shadow-xl overflow-hidden" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.id + (item.variant_id || '')} className="flex gap-4 p-5 hover:bg-blue-50/40 transition">
                  <img src={item.image || '/placeholder-product.png'} alt={item.title} className="h-20 w-20 shrink-0 rounded-xl object-cover border" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-sm font-medium text-blue-700">{formatCurrency(item.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold hover:bg-slate-200"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold hover:bg-slate-200"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => removeItem(item.id)} aria-label="Remove" className="ml-2 rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="text-right min-w-[6rem]">
                    <div className="text-lg font-extrabold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-white border shadow-xl p-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium">{formatCurrency(getSubtotal())}</span></div>
              <div className="flex justify-between text-2xl font-extrabold text-slate-900 mt-4 pt-4 border-t"><span>Total</span><span>{formatCurrency(getTotal())}</span></div>
              <a href="/checkout" className="mt-6 block w-full rounded-xl bg-blue-700 px-6 py-4 text-center text-base font-extrabold text-white shadow-lg hover:bg-blue-800">Proceed to Checkout</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
