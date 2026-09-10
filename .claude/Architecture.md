# System Architecture & Technical Specifications

## 🛠️ Core Tech Stack
- **Framework**: Next.js 14+ (App Router, RSC, Server Actions)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Storage)
- **State Management**: Zustand (`useCart.ts` with `persist` middleware)
- **Styling**: Tailwind CSS + `clsx` / `tailwind-merge` (`cn()` utility)
- **Deployment**: Vercel (Edge-optimized static asset delivery & API routes)

---

## 📂 File Directory Map

```text
my-ecommerce-template/
├── .claude/                   # AI guidance docs & audits
├── CLAUDE.md                  # Root AI instruction contract
├── MEMORY.md                  # Dev state log
├── config/site.ts             # Master site configuration
├── supabase/schema.sql        # Database migration script
├── types/supabase.ts          # Auto-generated database types
├── lib/
│   ├── supabase/              # Client, server, and middleware auth utilities
│   ├── store/useCart.ts       # Zustand cart store
│   └── utils.ts               # Price formatters, cn(), WhatsApp generators
├── components/
│   ├── storefront/            # Public store components
│   ├── checkout/              # eSewa, COD, and WhatsApp modals
│   ├── admin/                 # POS search & inventory management
│   └── ui/                    # Reusable shadcn/ui style components
└── app/                       # Next.js App Router (Storefront, Admin, API routes)