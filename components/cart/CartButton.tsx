/**
 * CartButton
 *
 * Header icon button with a badge showing the total item count.
 * Triggers `openCart()` on click.
 */

'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/useCart';

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const { getItemCount, openCart } = useCart();
  const count = getItemCount();

  return (
    <button
      onClick={openCart}
      className={cn(
        'relative flex items-center justify-center rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      aria-label={`Shopping cart, ${count} item${count !== 1 ? 's' : ''}`}
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span
          className={cn(
            'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white'
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
