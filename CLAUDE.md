# Root AI Instruction Contract — Updated 2026-09-11

## 🤖 Role & Rules
Expert full-stack developer on Next.js 14 App Router (build: 16.3.4 / Turbopack) + Supabase e-commerce template.

## ✅ Completed Audit (2026-09-11 — 35/35 Checkpoints)
- Product detail: `app/store/[slug]/page.tsx` (query by slug + notFound)
- Category filter: `app/(store)/page.tsx` (DB mapping + URL param filter)
- Price format: `formatCurrency` divides by 100; all products render `$49.99` etc.
- Server actions: all wrapped in `try/catch`; `createCategory` slug auto-gen + dedupe
- Build: `npm run build` passes; `npm run lint` passes
- Seed verified: `POST /api/setup/seed` → 200 OK; 4 categories + 6 products
- Admin CRUD: `/admin/products` fully operational
- Session handoff: `SESSION_HANDOFF.md` updated with full audit

## ⚡ Verified Commands
```bash
npm run dev        # Next.js 16 dev (Turbopack)
npm run build      # Verified 2026-09-11 — passes
npm run lint       # Verified — passes (non-standard NODE_ENV warning only)
```

## 🏗️ Infrastructure & Security (Verified 2026-09-10 / 11)
- RLS: enabled on all tables; `profiles_own_read` fixed (no self-subquery)
- Admin check: `public.is_admin(user_id)` SECURITY DEFINER used
- Insert policies: `WITH CHECK (true)` present
- Service role: `SUPABASE_SERVICE_ROLE_KEY` configured in all Vercel envs
- Seed endpoint uses `service_role`; verified 200 OK

## 🗂️ Route Mappings (Verified)
| Route | File | Status |
|---|---|---|
| `/` | `app/(store)/page.tsx` | ✅ Dynamic |
| `/store/[slug]` | `app/store/[slug]/page.tsx` | ✅ NEW |
| `/admin` | `app/admin/page.tsx` | ✅ POS |
| `/admin/products` | `app/admin/products/page.tsx` | ✅ CRUD |
| `/admin/inventory` | `app/admin/inventory/page.tsx` | ✅ |
| `/admin/categories` | — | ❌ MISSING |
| `/admin/orders` | `app/api/orders/route.ts` only | ❌ PAGE MISSING |
| `/cart` | Drawer (`CartDrawer`) | ✅ Client |
| `/checkout` | Modal (`CheckoutModal`) | ✅ Client |
| `/checkout/success` | — | ❌ MISSING |
| `/checkout/cancel` | — | ❌ MISSING |
| `/pos` | `/admin/page.tsx` | ✅ (via nav) |
| `/api/setup/seed` | `app/api/setup/seed/route.ts` | ✅ |
| `/api/orders` | `app/api/orders/route.ts` | ✅ |
| `/api/webhooks/stripe` | — | ❌ MISSING |
| `/api/checkout` (Stripe session) | — | ❌ MISSING |

## 🔧 Key Defaults
- Brand: `Apex Store` (`config/site.ts`)
- Currency: USD (`$`), prefix, 8% tax
- DB URL: `https://viwgrgriewcwmwslljix.supabase.co`
- Live: `https://website-template-lovat-nine.vercel.app/`

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know — APIs, conventions, file structure may differ.
<!-- END:nextjs-agent-rules -->
