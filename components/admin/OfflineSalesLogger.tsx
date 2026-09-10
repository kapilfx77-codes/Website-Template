'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Receipt, ArrowRight, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/client';

export interface OfflineSaleItem {
  name: string;
  quantity: number;
  unitPrice: number; // in cents
  total: number;
}

export interface OfflineSalesLoggerProps {
  onLogComplete?: (orderId: string) => void;
}

export function OfflineSalesLogger({ onLogComplete }: OfflineSalesLoggerProps) {
  const [items, setItems] = useState<OfflineSaleItem[]>([
    { name: 'Sample Product A', quantity: 1, unitPrice: 1999, total: 1999 },
  ]);
  const [tendered, setTendered] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * siteConfig.localization.taxRatePercentage) / 100;
  const totalAmount = subtotal + taxAmount;
  const changeDue = Math.max(0, tendered - totalAmount);

  const handleItemChange = (index: number, field: 'name' | 'quantity' | 'unitPrice', value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (field === 'quantity') {
        const qty = Math.max(1, Number(value));
        item.quantity = qty;
        item.total = qty * item.unitPrice;
      } else if (field === 'unitPrice') {
        const price = Math.max(0, Number(value));
        item.unitPrice = price;
        item.total = item.quantity * price;
      } else if (field === 'name') {
        item.name = value as string;
      }
      return updated;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { name: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (items.length === 0 || items.some((i) => !i.name.trim() || i.unitPrice <= 0)) {
      setError('Please complete all item details with valid prices.');
      return;
    }
    if (tendered < totalAmount) {
      setError(`Tendered amount must be equal to or greater than total (${(totalAmount / 100).toFixed(2)}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          status: 'delivered',
          payment_method: 'cod',
          total_amount: Math.round(totalAmount),
          shipping_address: 'In-Store Counter',
          notes: `Manual Counter Sale for ${customerName}. Tendered: ${(tendered / 100).toFixed(2)}. Change: ${(changeDue / 100).toFixed(2)}.`,
        })
        .select('id')
        .single();

      if (orderError || !orderData) {
        throw new Error('Failed to log order to database.');
      }

      const orderId = orderData.id;

      const itemPayload = items.map((item) => ({
        order_id: orderId,
        quantity: item.quantity,
        unit_price: Math.round(item.unitPrice),
        total_price: Math.round(item.total),
        product_id: null,
        variant_id: null,
      }));

      const { error: itemError } = await supabase.from('order_items').insert(itemPayload);
      if (itemError) {
        throw new Error('Failed to log order items to database.');
      }

      setIsSubmitted(true);
      if (onLogComplete) onLogComplete(orderId);
    } catch (err: any) {
      setError(err.message || 'Failed to save order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden" aria-label="Offline Sales Logger">
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <Receipt className="h-6 w-6" />
          <div>
            <h3 className="text-lg font-extrabold">Offline Sales Logger</h3>
            <p className="text-xs font-medium text-blue-100">Log manual walk-in / cash sales at the counter.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">Sale Logged</h4>
            <p className="text-sm text-slate-500">Manual counter sale saved to Supabase.</p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setCustomerName('');
                setTendered(0);
                setItems([{ name: 'Sample Product A', quantity: 1, unitPrice: 1999, total: 1999 }]);
              }}
              className="mt-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-700"
            >
              Log Another Sale
            </button>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="cash-customer" className="mb-1.5 block text-sm font-medium text-slate-700">Customer Name *</label>
              <input
                id="cash-customer"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Items Sold</h4>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs text-center outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={(item.unitPrice / 100).toFixed(2)}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) * 100)}
                          className="w-full rounded-lg border border-slate-200 pl-6 pr-2 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-xs font-bold text-slate-700">
                      ${(item.total / 100).toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="rounded-md bg-red-50 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                        aria-label="Remove item"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItemRow} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                <Plus className="h-3 w-3" /> Add another item
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tendered" className="mb-1.5 block text-sm font-medium text-slate-700">Tendered Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    id="tendered"
                    type="number"
                    min={0}
                    step={0.01}
                    value={(tendered / 100).toFixed(2)}
                    onChange={(e) => setTendered(Math.round(parseFloat(e.target.value) * 100))}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-7 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Change Due</label>
                <div className="flex h-10 items-center rounded-lg bg-green-50 px-3 border border-green-200 text-green-700 font-extrabold">
                  ${(changeDue / 100).toFixed(2)}
                  <ArrowRight className="ml-auto h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 space-y-2 border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax ({siteConfig.localization.taxRatePercentage}%)</span>
                <span className="font-medium">${(taxAmount / 100).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xl font-extrabold text-slate-900">
                <span>Total</span>
                <span>${(totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {isSubmitting ? 'Processing...' : 'Log Cash Sale to Database'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
