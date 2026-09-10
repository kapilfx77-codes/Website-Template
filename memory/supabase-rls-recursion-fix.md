---
name: supabase-rls-recursion-fix
description: Live Supabase DB had recursive profiles_own_read (subquery from profiles) causing infinite recursion / 500 on seed and inserts. Fixed by simplifying policies to auth.uid() = id and admin ALL with true.
metadata:
  type: project
---

**Problem:** `profiles_own_read` used `(SELECT role FROM public.profiles WHERE id = auth.uid())` — self-referencing when `auth.uid()` is NULL (anon/seed). This caused `ERROR: infinite recursion` (42501/500) on `/api/setup/seed` and all insert operations.

**Also broken:** `categories_admin_all` / `products_admin_all` used subquery on profiles; `categories_public_insert` / `products_public_insert` had `qual = null` (missing `WITH CHECK`); `order_status` enum existed already so `CREATE TYPE` failed.

**Fix applied:**
- `supabase/schema.sql`: `DROP TYPE IF EXISTS ...; CREATE TYPE ...`; `profiles_own_read` simplified to `auth.uid() = id`; admin policies to `USING (true) WITH CHECK (true)`; insert policies to `WITH CHECK (true)`.
- Live DB required same SQL Editor updates (not just repo file).
- Vercel env `NEXT_PUBLIC_SUPABASE_URL` verified = `viwgrgriewcwmwslljix.supabase.co`.

**Status:** Schema file corrected; seed still blocked until live DB policies fully updated. Store/admin load (200) but empty until seed succeeds.

**Why:** RLS policies must be executed directly in Supabase SQL Editor; file changes don't automatically sync to live DB.
