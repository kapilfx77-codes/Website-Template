# UI/UX & Design System Rules

## 🎨 Theme & Color Palette
All color values are defined in `globals.css` using CSS custom variables and driven by `config/site.ts`:

- **Primary**: Brand accent (e.g., `#10B981` / eSewa Green or Custom Brand Color)
- **Background**: Modern neutral background (`#FAFAFA` light / `#09090B` dark)
- **Surface Cards**: High-contrast bordered containers with crisp shadows.

---

## 📱 Mobile-First UX Principles
1. **Thumb-Friendly Actions**: Primary action buttons (Add to Cart, Checkout) are pinned or easily reachable on mobile devices.
2. **Instant Feedback**: Skeletal loaders on product grid transitions and instant optimistic updates in the Zustand cart drawer.
3. **Modal Drawers**: Cart drawer slides in smoothly without forcing full-page reloads.

---

## 🧩 Component Guidelines
- Use atomic design structure inside `components/ui/` for buttons, badges, dialogs, and text inputs.
- Combine classes using `cn()` from `lib/utils.ts` for clean tailwind overrides.