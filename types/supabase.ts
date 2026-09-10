/**
 * Type-safe Supabase Database Types
 * Auto-generated from supabase/schema.sql
 *
 * These interfaces mirror the PostgreSQL schema and are used
 * across the codebase for type-safe DB operations.
 */

// Base database record types
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

// Profiles
export interface Profiles extends DatabaseRecord {
  id: string; // references auth.users(id)
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin' | 'vendor';
}

// Categories
export interface Categories extends DatabaseRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string; // self-referencing FK to categories.id
  is_active: boolean;
  sort_order: number;
}

// Products
export interface Products extends DatabaseRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id?: string; // FK to categories.id
  sku?: string;
  price: number; // in cents (or base currency units)
  compare_at_price?: number;
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
}

// Product Variants
export interface ProductVariants extends DatabaseRecord {
  id: string;
  product_id: string; // FK to products.id
  sku?: string;
  title?: string;
  price: number;
  compare_at_price?: number;
  options: Record<string, any>; // JSONB stored as object
  stock: number;
  is_active: boolean;
}

// Orders
export interface Orders extends DatabaseRecord {
  id: string;
  user_id?: string; // FK to profiles.id (nullable for guest orders)
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_method?:
    | 'stripe'
    | 'paypal'
    | 'esewa'
    | 'khalti'
    | 'cod'
    | 'bank_transfer'
    | 'whatsapp';
  total_amount: number; // in cents
  shipping_address?: string;
  billing_address?: string;
  tracking_number?: string;
  notes?: string;
}

// Order Items
export interface OrderItems extends DatabaseRecord {
  id: string;
  order_id: string; // FK to orders.id
  product_id?: string; // FK to products.id (nullable)
  variant_id?: string; // FK to product_variants.id (nullable)
  quantity: number;
  unit_price: number; // per-unit price in cents
  total_price: number; // total for this line in cents
}

// Inventory
export interface Inventory extends DatabaseRecord {
  id: string;
  product_id: string; // FK to products.id
  variant_id?: string; // FK to product_variants.id (nullable)
  stock: number;
  reserved: number; // reserved for pending orders
  operation: 'in' | 'out' | 'adjustment';
  notes?: string;
  created_by?: string; // FK to profiles.id
}

// Vouchers
export interface Vouchers extends DatabaseRecord {
  id: string;
  code: string; // unique promo code
  type: 'percent' | 'fixed_amount';
  value: number; // discount value in base currency units (e.g., 10 = 10%)
  max_usage: number; // max number of times this voucher can be used (1 = single-use)
  usage_count: number;
  valid_from: string;
  valid_until?: string; // ISO date string, null = never expires
  is_active: boolean;
}

// Insert/Update types (for API payloads)
export interface InsertProfiles {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin' | 'vendor';
}

export interface InsertCategories {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface InsertProducts {
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  image_urls?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface InsertProductVariants {
  product_id: string;
  sku?: string;
  title?: string;
  price: number;
  compare_at_price?: number;
  options?: Record<string, any>;
  stock?: number;
  is_active?: boolean;
}

export interface InsertOrders {
  user_id?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_method?:
    | 'stripe'
    | 'paypal'
    | 'esewa'
    | 'khalti'
    | 'cod'
    | 'bank_transfer'
    | 'whatsapp';
  total_amount: number;
  shipping_address?: string;
  billing_address?: string;
  tracking_number?: string;
  notes?: string;
}

export interface InsertOrderItems {
  order_id: string;
  product_id?: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface InsertInventory {
  product_id: string;
  variant_id?: string;
  stock?: number;
  reserved?: number;
  operation?: 'in' | 'out' | 'adjustment';
  notes?: string;
  created_by?: string;
}

export interface InsertVouchers {
  code: string;
  type: 'percent' | 'fixed_amount';
  value: number;
  max_usage?: number;
  valid_until?: string;
  is_active?: boolean;
}

// Enum type exports for reuse
export const RoleOptions = ['customer', 'admin', 'vendor'] as const;
export const OrderStatusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;
export const PaymentMethodOptions = ['stripe', 'paypal', 'esewa', 'khalti', 'cod', 'bank_transfer', 'whatsapp'] as const;
export const VoucherTypeOptions = ['percent', 'fixed_amount'] as const;
export const InventoryOperationOptions = ['in', 'out', 'adjustment'] as const;

// Type-safe enums
export type Role = typeof RoleOptions[number];
export type OrderStatus = typeof OrderStatusOptions[number];
export type PaymentMethod = typeof PaymentMethodOptions[number];
export type VoucherType = typeof VoucherTypeOptions[number];
export type InventoryOperation = typeof InventoryOperationOptions[number];