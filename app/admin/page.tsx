'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Receipt, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { POSQuickSearch } from '@/components/admin/POSQuickSearch';
import { StockAdjuster } from '@/components/admin/StockAdjuster';

// Minimal local types for POS basket
interface POSBasketItem {
  id: string; // variantId or productId
  title: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  stock: number;
}

export default function AdminPOSPage() {
  const [basket, setBasket] = useState<POSBasketItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Feature check: if POS disabled, show message
  if (!siteConfig.features.enablePOS) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl border border-slate-200">
          <ShoppingCart className="mx-auto h-16 w-16 text-amber-300" />
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">POS Disabled</h1>
          <p className="mt-2 text-slate-500">Enable <code className="font-mono text-sm text-blue-600">features.enablePOS</code> in site config to use this dashboard.</p>
        </div>
      </div>
    );
  }

  const handleAddToBasket = (variant: any) => {
    setBasket((prev) => {
      const existing = prev.find(
        (item) => item.id === variant.id || (variant.variant_id && item.id === variant.variant_id)
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: variant.id,
          title: variant.title || (variant as any).products?.name || 'Unknown',
          price: variant.price,
          quantity: 1,
          image: (variant as any).products?.image_urls?.[0] || '/placeholder-product.png',
          stock: (variant as any).stock || 0,
        },
      ];
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const updateQuantity = (id: string, delta: number) => {
    setBasket((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (subtotal * siteConfig.localization.taxRatePercentage) / 100;
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">POS Counter Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Quick search, counter basket, receipt, and inventory adjustments.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
              {siteConfig.shortName}
            </div>
          </div>
        </header>

        {/* Search */}
        <section aria-label="Quick Product Search" className="mb-8">
          <POSQuickSearch onAddToBasket={handleAddToBasket} />
        </section>

        {/* Add Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-4">
            Added to basket
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Basket */}
          <section aria-label="Active Counter Basket" className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-5">
                <ShoppingCart className="h-6 w-6 text-white" />
                <div>
                  <h2 className="text-xl font-extrabold text-white">Counter Basket</h2>
                  <p className="text-xs font-medium text-blue-200">{basket.length} item{basket.length !== 1 ? 's' : ''} in basket</p>
                </div>
              </div>

              <div className="p-6">
                {basket.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <ShoppingCart className="mx-auto h-12 w-12 mb-3" />
                    <p className="font-medium">Your basket is empty.</p>
                    <p className="text-sm">Use the search bar above to add products.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ul role="list" aria-label="Basket items" className="divide-y divide-slate-100">
                      {basket.map((item) => (
                        <li key={item.id} className="flex items-start gap-4 py-3">
                          <img src={item.image} alt={item.title} className="h-14 w-14 shrink-0 rounded-lg object-cover border border-slate-200" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                            <p className="text-xs text-slate-500">Unit Price: ${item.price / 100}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200">-</button>
                            <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200">+</button>
                          </div>
                          <div className="text-right min-w-[4rem]">
                            <span className="font-extrabold text-slate-900">${(item.price * item.quantity / 100).toFixed(2)}</span>
                          </div>
                          <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">${(subtotal / 100).toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Tax ({siteConfig.localization.taxRatePercentage}%)</span><span className="font-medium">${(tax / 100).toFixed(2)}</span></div>
                      <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xl font-extrabold text-slate-900"><span>Total</span><span>${(total / 100).toFixed(2)}</span></div>
                    </div>

                    <button
                      onClick={() => alert('Receipt Printed: Total ' + (total / 100).toFixed(2))}
                      className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-extrabold text-white shadow-lg hover:bg-blue-700 active:scale-[0.99] flex items-center justify-center gap-2 transition"
                    >
                      <Receipt className="h-5 w-5" /> Print Receipt & Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right: Stock Adjuster + Offline Sales */}
          <aside aria-label="Inventory & Cash Tools" className="lg:col-span-5 space-y-6">
            <section aria-label="Quick Stock Adjustment">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Quick Stock Adjustment</h2>
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
                <p className="text-sm text-slate-500 mb-3">Select a product to adjust inventory instantly.</p>
                {/* For demo, show a sample adjuster; in production, this would loop over results */}
                <StockAdjuster productId="sample-product-id" variantId="sample-variant-id" currentStock={42} />
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800">
                  Adjustments sync directly to the <code className="font-mono text-amber-900">inventory</code> table.
                </div>
              </div>
            </section>

            <section aria-label="Offline Cash Logger">
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Offline Sales Logger</h2>
              <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-lg p-5">
                <p className="text-sm text-slate-500 mb-3">Log manual cash sales at the counter directly to Supabase.</p>
                <a href="/admin/offline-sales" className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-extrabold text-white shadow transition hover:bg-blue-700">Open Offline Logger</a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
