# Pre-Launch 20-Point Audit Checklist

## 🔒 Security & Database
- [ ] 01. Supabase RLS enabled on `products`, `orders`, and `inventory` tables.
- [ ] 02. API route keys correctly scoped (`NEXT_PUBLIC_SUPABASE_URL` vs Server Secret Keys).
- [ ] 03. Admin routes (`/admin`) protected via auth middleware (`lib/supabase/middleware.ts`).

## 🏎️ Performance & SEO
- [ ] 04. Dynamic metadata populated in `app/layout.tsx`.
- [ ] 05. Native Next.js SEO files active (`app/robots.ts`, `app/sitemap.ts`).
- [ ] 06. Product images served using Next.js `<Image />` with optimized domains config.
- [ ] 07. Page bundle size checked with no redundant dependencies.

## 🛒 Storefront & Checkout
- [ ] 08. Cart state persists across page refreshes (`useCart.ts`).
- [ ] 09. Price calculations accurate with localized formatting (`formatPrice()`).
- [ ] 10. eSewa QR payment modal displays valid store credentials.
- [ ] 11. WhatsApp order redirect creates valid formatted text.
- [ ] 12. COD form validates phone number and shipping address.

## 📟 Admin & POS
- [ ] 13. POS quick search returns items under 100ms.
- [ ] 14. Stock reduction reflects instantly after an offline sale.
- [ ] 15. Manual sales logger handles out-of-stock edge cases gracefully.

## 🌐 Deployment
- [ ] 16. Custom 404 page configured (`app/not-found.tsx`).
- [ ] 17. Master white-label config verified in `config/site.ts`.
- [ ] 18. Favicon and asset links verified in `public/images/`.
- [ ] 19. Vercel environment variables fully synchronized.
- [ ] 20. Production build executes without TypeScript or Lint errors (`npm run build`).