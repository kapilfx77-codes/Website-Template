/**
 * Persistent Zustand Cart Store
 *
 * Uses `persist` middleware to keep the cart in localStorage across page reloads.
 * Reads `currencyPosition`, `currencySymbol`, and `taxRatePercentage` from `@/config/site`
 * for localized formatting and tax calculations.
 *
 * All cart items reference product data via IDs — the UI layer handles data fetching.
 * Voucher discounts are calculated against the subtotal before tax.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export interface CartItem {
  /** FK to product_variants.id or products.id */
  id: string;
  title: string;
  price: number; // unit price in cents
  image: string; // thumbnail URL
  variant_id?: string; // optional: FK to product_variants.id
  quantity: number;
  options?: Record<string, any>; // e.g. { size: 'M', color: 'blue' }
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  selectedVoucherCode: string | null;
  selectedVoucher: { type: string; value: number } | null;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Voucher actions
  applyVoucher: (code: string) => void;
  removeVoucher: () => void;

  // Calculations
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

/**
 * Format number as currency using site config.
 * If currencyPosition is "prefix", returns "$100"; if "suffix", returns "100 $".
 */
export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const formatted = abs.toFixed(2);

  if (siteConfig.localization.currencyPosition === 'prefix') {
    return `${siteConfig.localization.currencySymbol}${formatted}`;
  }
  return `${formatted} ${siteConfig.localization.currencySymbol}`;
}

/**
 * Format number without currency (used for display in summaries).
 */
export function formatNumber(num: number): string {
  return num.toFixed(2);
}

/**
 * Format number without currency (used for display in summaries).
 */


export const useCart = create<CartState>(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      selectedVoucherCode: null,
      selectedVoucher: null,

      // --- ADD ITEM ---
      // If item already exists in cart, increment quantity; otherwise push new item.
      addItem: (newItem) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.id === newItem.id && JSON.stringify(item.options) === JSON.stringify(newItem.options)
        );

        if (existingIndex >= 0) {
          // Increment existing item quantity
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity =
            (updatedItems[existingIndex].quantity ?? 1) + (newItem.quantity ?? 1);
          set({ items: updatedItems });
        } else {
          // Push new item
          set({ items: [...items, { ...newItem, quantity: newItem.quantity ?? 1 }] });
        }
      },

      // --- REMOVE ITEM ---
      removeItem: (itemId: string) =>
        set({
          items: get().items.filter((item) => item.id !== itemId),
        }),

      // --- UPDATE QUANTITY ---
      updateQuantity: (itemId: string, quantity: number) =>
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        }),

      // --- CLEAR CART ---
      clearCart: () => set({ items: [] }),

      // --- TOGGLE CART ---
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // --- OPEN / CLOSE ---
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // --- VOUCHER ACTIONS ---
      applyVoucher: (code: string) => {
        // Lookup voucher from DB via Supabase (stub: assumes code matches format)
        // In production, this would fetch from /api/vouchers/validate
        // For now, we apply a simple fixed/percent discount based on code heuristics
        const voucherMap: Record<string, { type: string; value: number }> = {};

        // Read from config if predefined, otherwise default
        const { taxRatePercentage } = siteConfig.localization;

        // Heuristic: if code starts with 'SAVE', apply 10% discount
        if (code.toUpperCase().startsWith('SAVE')) {
          set({
            selectedVoucherCode: code,
            selectedVoucher: { type: 'percent', value: 10 },
          });
        } else if (code.toUpperCase().startsWith('FLAT')) {
          set({
            selectedVoucherCode: code,
            selectedVoucher: { type: 'fixed_amount', value: 2000 }, // $20.00 in cents
          });
        } else {
          // Generic: try to parse as percentage
          const parsed = parseFloat(code.replace(/[^0-9.-]/g, ''));
          if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
            set({
              selectedVoucherCode: code,
              selectedVoucher: { type: 'percent', value: parsed },
            });
          }
        }
      },

      removeVoucher: () =>
        set({
          selectedVoucherCode: null,
          selectedVoucher: null,
        }),

      // --- CALCULATIONS ---

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        // Tax is applied to subtotal after discount
        return (subtotal * siteConfig.localization.taxRatePercentage) / 100;
      },

      getDiscountAmount: () => {
        const { selectedVoucher } = get();
        if (!selectedVoucher) return 0;

        const subtotal = get().getSubtotal();
        const { type, value } = selectedVoucher;

        if (type === 'percent') {
          return (subtotal * value) / 100;
        } else if (type === 'fixed_amount') {
          // Cannot discount more than subtotal
          return Math.min(value, subtotal);
        }
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxAmount();
        const discount = get().getDiscountAmount();
        return subtotal + tax - discount;
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + (item.quantity ?? 1), 0);
      },
    }),
    {
      name: 'cart-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist items + isOpen; exclude calculation derived state
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
        selectedVoucherCode: state.selectedVoucherCode,
        selectedVoucher: state.selectedVoucher,
      }),
    }
  )
);