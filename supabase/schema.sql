-- ============================================================
-- Phase 1: Database & Supabase Infrastructure
-- E-commerce Platform Schema (PostgreSQL + RLS)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('stripe', 'paypal', 'esewa', 'khalti', 'cod', 'bank_transfer', 'whatsapp');
CREATE TYPE voucher_type AS ENUM ('percent', 'fixed_amount');
CREATE TYPE inventory_operation AS ENUM ('in', 'out', 'adjustment');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Profiles (linked to auth.users via id)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    phone text,
    address text,
    role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'vendor')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active boolean DEFAULT true,
    sort_order int DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    sku text UNIQUE,
    price numeric(12,2) NOT NULL DEFAULT 0,
    compare_at_price numeric(12,2),
    image_urls text[],
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    meta_title text,
    meta_description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku text UNIQUE,
    title text,
    price numeric(12,2) NOT NULL,
    compare_at_price numeric(12,2),
    options jsonb DEFAULT '{}',
    stock int DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending',
    payment_method payment_method,
    total_amount numeric(12,2) NOT NULL DEFAULT 0,
    shipping_address text,
    billing_address text,
    tracking_number text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity int NOT NULL DEFAULT 1,
    unit_price numeric(12,2) NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Inventory
CREATE TABLE IF NOT EXISTS public.inventory (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
    stock int NOT NULL DEFAULT 0,
    reserved int DEFAULT 0,
    operation inventory_operation DEFAULT 'adjustment',
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Vouchers
CREATE TABLE IF NOT EXISTS public.vouchers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text UNIQUE NOT NULL,
    type voucher_type NOT NULL,
    value numeric(12,2) NOT NULL,
    max_usage int DEFAULT 1,
    usage_count int DEFAULT 0,
    valid_from timestamptz DEFAULT now(),
    valid_until timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code) WHERE is_active = true;

-- ============================================================
-- 4. UPDATED_AT AUTO-UPDATE TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp_inventory()
RETURNS trigger AS $$
BEGIN
  NEW.created_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT unnest(array['profiles','categories','products','product_variants','orders','vouchers'])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp()', t, t);
    END LOOP;
END $$;

CREATE TRIGGER trg_inventory_timestamp
    BEFORE INSERT ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp_inventory();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Profiles: owner/admin read, owner update
CREATE POLICY profiles_own_read ON public.profiles FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY profiles_own_update ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_own_insert ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories: public read active, admin full
CREATE POLICY categories_public_read ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY categories_admin_all ON public.categories FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Products: public read active, admin full
CREATE POLICY products_public_read ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY products_admin_all ON public.products FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Product Variants: public read via active product, admin full
CREATE POLICY variants_public_read ON public.product_variants FOR SELECT USING (is_active = true AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_variants.product_id AND p.is_active = true));
CREATE POLICY variants_admin_all ON public.product_variants FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Orders: owner/admin read, owner insert (guest via anon not allowed by auth.uid() check)
CREATE POLICY orders_own_read ON public.orders FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY orders_own_insert ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL); -- allows anonymous if needed; strict to user otherwise
CREATE POLICY orders_own_update ON public.orders FOR UPDATE USING (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Order Items: owner/admin read, cascade insert via order
CREATE POLICY order_items_own_read ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')));
CREATE POLICY order_items_insert ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR auth.uid() IS NULL)));

-- Inventory: admin only for modifications, public no-read (internal)
CREATE POLICY inventory_admin_all ON public.inventory FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Vouchers: public read active, admin full
CREATE POLICY vouchers_public_read ON public.vouchers FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));
CREATE POLICY vouchers_admin_all ON public.vouchers FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin') WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================
-- 6. COMMENTS
-- ============================================================
COMMENT ON TABLE public.profiles IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE public.categories IS 'Product category hierarchy';
COMMENT ON TABLE public.products IS 'Storefront products';
COMMENT ON TABLE public.product_variants IS 'SKU-level variants (size, color, etc.)';
COMMENT ON TABLE public.orders IS 'Customer orders';
COMMENT ON TABLE public.order_items IS 'Line items inside an order';
COMMENT ON TABLE public.inventory IS 'Stock tracking per product/variant';
COMMENT ON TABLE public.vouchers IS 'Promo / discount codes';
