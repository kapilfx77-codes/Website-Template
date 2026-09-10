# Project Development Roadmap & Phases

## 📍 Phase 1: Foundation & Setup
- [ ] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- [ ] Execute `supabase/schema.sql` migration on Supabase project.
- [ ] Configure `config/site.ts` with master store metadata.

## 📍 Phase 2: Storefront & Cart Management
- [ ] Implement layout and header navigation (`components/storefront/`).
- [ ] Build dynamic Product Grid & Product Cards (`app/(store)/page.tsx`).
- [ ] Connect persistent shopping cart using Zustand (`lib/store/useCart.ts`).

## 📍 Phase 3: Checkout System
- [ ] Construct `CheckoutModal.tsx` supporting multi-payment choice.
- [ ] Implement `EsewaPaymentQR.tsx` with dynamic payment link & transaction reference.
- [ ] Implement WhatsApp Order Link generator (`generateWhatsAppLink()`).

## 📍 Phase 4: Admin & POS Counter Dashboard
- [ ] Build `app/admin/page.tsx` for quick sales counters.
- [ ] Implement `POSQuickSearch.tsx` for instant offline checkout.
- [ ] Connect `StockAdjuster.tsx` with live database stock mutation.

## 📍 Phase 5: Audit & Deployment
- [ ] Pass all items in `.claude/Audit.md`.
- [ ] Deploy to Vercel and verify production domain.