# Root AI Instruction Contract

## 🤖 Role & Rules
You are an expert full-stack developer assisting on this Next.js 14 (App Router) + Supabase e-commerce template.

### Core Guidelines:
1. **Directory Integrity**: Maintain the established directory layout strictly. Do not introduce root-level arbitrary folders.
2. **Type Safety**: Strictly import database types from `@/types/supabase`.
3. **Component Separation**:
   - Use Server Components (RSC) for data fetching whenever possible (`app/` pages).
   - Reserve `"use client"` for interactive components (`components/ui`, cart, modals).
4. **Configuration First**: Always source brand names, payment settings, and contact info from `@/config/site`. Never hardcode store credentials in components.

---

## ⚡ Useful Commands
```bash
npm run dev        # Run local dev server
npm run build      # Test production build
npm run lint       # Run linter checks