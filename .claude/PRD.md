# Product Requirements Document (PRD)

## 📌 Project Overview
**Name:** Universal White-Label E-Commerce & In-Store POS System  
**Goal:** A high-performance, mobile-first e-commerce store with an integrated POS dashboard designed for localized retail (e.g., eSewa, Cash on Delivery, WhatsApp orders) and online sales.

---

## 🎯 Target Audience
1. **Online Shoppers**: Mobile-first users who want fast browsing, persistent carts, and frictionless local checkout (eSewa, WhatsApp, COD).
2. **Store Managers / Admins**: Retail staff operating in-store who need fast POS item search, offline sales logging, and real-time stock adjustments.

---

## 🔑 Key Features

### Storefront (Public)
- **Catalog & Filtering**: Fast product browsing with dynamic category filters.
- **Shopping Cart**: Persistent client-side cart (`useCart.ts` via Zustand).
- **Localized Checkout**:
  - **eSewa**: QR code popup with transaction reference.
  - **COD**: Simple delivery detail capture.
  - **WhatsApp Direct**: Instant order generation via `generateWhatsAppLink()`.

### Admin & POS Counter
- **POS Quick Search**: Lightning-fast barcode/name lookup for in-person customers.
- **Offline Sales Logger**: Log cash/manual sales directly into Supabase.
- **Stock Adjuster**: Real-time stock sync with instant UI feedback.

---

## ⚙️ Configuration & Reusability
- Fully controlled via `config/site.ts` for instant re-branding (store name, currency, phone, eSewa merchant ID, and UI theme colors).