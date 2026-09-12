---
name: agentic-review
description: Multi-agent code review for security, performance, patterns.
---

# Best Skill: agentic-review (installed)

Used for this redesign: preserving APIs, reviewing structural changes across components/pages.

# Context Read
- CLAUDE.md: 35/35 audit done. Routes verified. Build passes.
- SESSION_HANDOFF.md: Live site `website-template-lovat-nine.vercel.app` verified.
- Installed skills: 21 from SZoloth/skill-pack in `.claude/skills/`.

# Design System Applied (SHOP.CO Figma — unaxIIfgqIVVuZqDBV2Wio)
- Primary backgrounds: #FFFFFF (main), #F0EEED (cards/search)
- Accents: #000000 (buttons/footers), #FF3333 (discount), #FFC107 (stars)
- Borders: rounded-full (buttons/search), rounded-[20px]/rounded-[40px] (cards)

# Files to Rewrite (frontend only — APIs/store/Stripe untouched)
1. app/globals.css — design tokens
2. components/storefront/Header.tsx — announcement bar + nav
3. app/page.tsx — hero + stats + brand strip + product grids + bento + reviews
4. components/storefront/Footer.tsx — newsletter + footer
5. components/storefront/ProductCard.tsx — card redesign
6. app/store/[slug]/page.tsx — PDP redesign (2-col, buy box, video, related)
7. components/BentoCategories.tsx — bento grid
8. components/Reviews.tsx — testimonial carousel
