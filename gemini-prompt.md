=== PROMPT FOR GEMINI / EXTERNAL HELP ===

**Live site:** https://website-template-lovat-nine.vercel.app/
**Repo:** Next.js 16 + Supabase (App Router) — admin inventory + store template.

**Error:** Seed (`POST /api/setup/seed`) returns 500 with messages:
- `infinite recursion detected in policy for relation "profiles"`
- `permission denied for table categories`
- `permission denied for table products`
- Log shows `401` (anon key rejected) + `42501` (policy denied) on `/rest/v1/categories?columns=...` and `/rest/v1/products?select=id`.

**DB URL (verified in .env.local):** `https://viwgrgriewcwmwslljix.supabase.co`
**Env (Vercel):** `NEXT_PUBLIC_SUPABASE_URL` = same URL; `SUPABASE_ANON_KEY` / `SERVICE_ROLE_KEY` present; `POSTGRES_*` vars also present.
**Connection:** Not broken. DB responds (401 = protected, expected); site renders (store/admin 200).

**Root cause:** RLS policies have:
1. `profiles_own_read` uses `(SELECT role FROM public.profiles WHERE id = auth.uid())` → recursive when `auth.uid()` NULL (anon/seed).
2. `categories_admin_all` / `products_admin_all` use subquery on profiles instead of `USING (true)`.
3. `categories_public_insert` / `products_public_insert` have `qual = null` (missing `WITH CHECK` clause in live DB, though `WITH CHECK (true)` exists in `schema.sql`).
4. `CREATE TYPE` in schema uses `IF NOT EXISTS` which Postgres doesn't support; fixed to `DROP TYPE IF EXISTS ...; CREATE TYPE ...`.

**File fixed:** `supabase/schema.sql` (lines 195, 201, 205, 223-224, 13-16 corrected).
**Live DB:** Requires SQL Editor application (drop/recreate policies). Not fully done yet.

**What needs to happen:**
1. Confirm `SELECT policyname, cmd, qual FROM pg_policies` in live DB shows broken subqueries / null.
2. Apply corrected SQL: simplify `profiles_own_read`, use `true` for admin + insert policies.
3. After DB fixes, `POST /api/setup/seed` must return 200 (seeded 4 categories + 6 products).
4. Store (`/`) must show products; admin (`/admin/products`) must list/edit/delete; add-to-cart and checkout must work.
5. Playwright E2E loop (already set up) passes when DB is populated.

**Why this wasn't solved:** The SQL changes in repo (`supabase/schema.sql`) don't auto-sync to live Supabase DB; must be executed manually in SQL Editor. Multiple iterations applied but policies rebuilt incorrectly or partial.

Ask for help: how to properly sync the corrected RLS policies to live DB, or diagnose why `WITH CHECK (true)` policies result in `permission denied` / `infinite recursion` after application.
=== CURRENT STATE (updated for Gemini) ===
- Seed: 500 (permission denied categories)
- Store/Admin: 200 (empty)
- SQL edited: is_admin SECURITY DEFINER provided; seed route uses serviceRoleKey
- Blocker: live DB policies not fully applied OR build needs redeploy after route change
- Action: apply SQL Editor fixes, deploy, retest.
