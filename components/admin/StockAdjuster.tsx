'use client';

import React, { useState } from 'react';
import { Minus, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/client';
import { Inventory } from '@/types/supabase';

interface StockAdjusterProps {
  productId?: string;
  variantId?: string;
  currentStock: number;
  onUpdate?: (newStock: number) => void;
}

export function StockAdjuster({ productId, variantId, currentStock, onUpdate }: StockAdjusterProps) {
  const [stockValue, setStockValue] = useState<number>(currentStock);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const supabase = createClient();

  const handleIncrement = () => {
    setStockValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setStockValue((prev) => Math.max(0, prev - 1));
  };

  const handleDirectInput = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setStockValue(parsed);
    } else if (value === '') {
      setStockValue(0);
    }
  };

  const syncToSupabase = async () => {
    if (!productId) return;
    setIsUpdating(true);
    setUpdateStatus('idle');

    try {
      // Insert into inventory table
      const { error } = await supabase.from('inventory').insert({
        product_id: productId,
        variant_id: variantId || null,
        stock: stockValue,
        reserved: 0,
        operation: 'adjustment',
        notes: 'Manual POS adjustment',
        created_by: null,
      });

      if (error) {
        throw error;
      }

      // Update product_variants if variantId exists
      if (variantId) {
        await supabase.from('product_variants').update({ stock: stockValue }).eq('id', variantId);
      } else {
        // Try updating products if only productId is given (and no variant)
        // Note: products table doesn't have stock directly in this schema; inventory handles it.
      }

      setUpdateStatus('success');
      if (onUpdate) onUpdate(stockValue);
      setTimeout(() => setUpdateStatus('idle'), 3000);
    } catch (err) {
      console.error('Stock update error:', err);
      setUpdateStatus('error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrement}
          aria-label="Decrease stock"
          className="rounded-md bg-slate-100 px-2.5 py-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={0}
          value={stockValue}
          onChange={(e) => handleDirectInput(e.target.value)}
          onBlur={syncToSupabase}
          aria-label="Stock quantity"
          className="w-16 rounded-md border border-slate-300 bg-slate-50 py-2 text-center text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
        />
        <button
          onClick={handleIncrement}
          aria-label="Increase stock"
          className="rounded-md bg-slate-100 px-2.5 py-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={syncToSupabase}
        disabled={isUpdating || stockValue === currentStock}
        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow transition hover:bg-blue-700 disabled:opacity-40 active:scale-[0.98]"
      >
        {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Sync'}
      </button>

      {updateStatus === 'success' && (
        <span className="flex items-center gap-1 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Updated
        </span>
      )}
      {updateStatus === 'error' && (
        <span className="text-xs font-medium text-red-600">Failed</span>
      )}
    </div>
  );
}
