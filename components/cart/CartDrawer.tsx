/**
 * CartDrawer — Sliding panel cart UI
 *
 * Displays items, voucher input, order summary, and checkout link.
 * Reads `siteConfig` for currency formatting and tax settings.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/useCart';
import { siteConfig } from '@/config/site';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTaxAmount,
    getDiscountAmount,
    getTotal,
    applyVoucher,
    removeVoucher,
    selectedVoucherCode,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [codeInput, setCodeInput] = useState('');
  const [applyFeedback, setApplyFeedback] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyVoucher = () => {
    if (!codeInput.trim()) return;
    applyVoucher(codeInput.trim());
    setApplyFeedback('Voucher applied');
    setCodeInput('');
    setTimeout(() => setApplyFeedback(null), 3000);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        onClick={closeCart}
        className={cn('absolute inset-0 bg-black/40 backdrop-blur-sm', !isOpen && 'hidden')}
        aria-label="Close cart"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-lg',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mounted && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
              <p className="mt-2 text-sm">Add some items to get started.</p>
              <button
                onClick={closeCart}
                className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items list */}
              <ul className="divide-y divide-slate-100" role="list" aria-label="Cart items">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        {item.options && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex items-center gap-2 rounded-full bg-slate-100">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-900">
                            ${(item.price * item.quantity / 100).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Voucher input */}
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <label htmlFor="voucher-code" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Tag className="h-4 w-4" />
                  Apply Voucher
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    id="voucher-code"
                    type="text"
                    placeholder="Enter code (e.g., SAVE10)"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyVoucher(); }}
                    className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
                {applyFeedback && (
                  <p className="mt-2 text-xs font-medium text-green-700 flex items-center gap-1">
                    <Check className="h-3 w-3" /> {applyFeedback}
                  </p>
                )}
                {selectedVoucherCode && (
                  <div className="mt-2 flex items-center justify-between rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
                    <span>Applied: {selectedVoucherCode}</span>
                    <button onClick={removeVoucher} className="underline hover:text-green-900">Remove</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Order summary */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${(subtotal / 100).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-medium">-${(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax ({siteConfig.localization.taxRatePercentage}%)</span>
                <span className="font-medium text-slate-900">${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="ml-auto">${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block w-full rounded-md bg-blue-600 px-6 py-3 text-center font-bold text-white shadow hover:bg-blue-700"
              onClick={closeCart}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
export default CartDrawer;
