# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-flow.spec.ts >> Live Flow — Admin → Storefront → Cart → Stripe >> Mobile Viewport Responsive Audit
- Location: tests\e2e\live-flow.spec.ts:41:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav, header, button')
Expected: visible
Error: strict mode violation: locator('nav, header, button') resolved to 18 elements:
    1) <header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">…</header> aka getByText('ApexApex Store POS$CatalogCategoriesIn-Store POS')
    2) <button aria-label="Toggle mobile menu" class="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden">…</button> aka getByRole('button', { name: 'Toggle mobile menu' })
    3) <button aria-label="Shopping cart, 0 items" class="relative flex items-center justify-center rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">…</button> aka getByRole('button', { name: 'Shopping cart, 0 items' })
    4) <nav class="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-slate-700">…</nav> aka getByText('CatalogCategoriesIn-Store POS')
    5) <button aria-label="Close cart" class="absolute inset-0 bg-black/40 backdrop-blur-sm hidden"></button> aka getByLabel('Close cart').first()
    6) <button aria-label="Close cart" class="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">…</button> aka locator('aside').getByLabel('Close cart')
    7) <button class="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">Continue Shopping</button> aka getByText('Continue Shopping')
    8) <button class="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap bg-primary text-primary-foreground font-semibold shadow-sm">All Products</button> aka getByRole('button', { name: 'All Products' })
    9) <button class="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap bg-secondary text-secondary-foreground hover:bg-secondary/80">Accessories</button> aka getByRole('button', { name: 'Accessories' })
    10) <button class="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap bg-secondary text-secondary-foreground hover:bg-secondary/80">Clothing</button> aka getByRole('button', { name: 'Clothing' })
    ...

Call log:
  - Expect "toBeVisible" locator('nav, header, button') with timeout 5000ms
  - waiting for locator('nav, header, button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - button "Toggle mobile menu" [ref=e5]
        - link "Apex" [ref=e7] [cursor=pointer]:
          - /url: /
        - button "Shopping cart, 0 items" [ref=e10]
      - navigation [ref=e16]:
        - link "Catalog" [ref=e17] [cursor=pointer]:
          - /url: /
        - link "Categories" [ref=e18] [cursor=pointer]:
          - /url: /store
        - link "In-Store POS" [ref=e19] [cursor=pointer]:
          - /url: /admin
    - generic [aria-hidden]:
      - complementary:
        - generic:
          - heading [level=2]: Your Cart
          - button
        - generic:
          - generic:
            - paragraph: Your cart is empty
            - paragraph: Add some items to get started.
            - button: Continue Shopping
    - main [ref=e20]:
      - generic [ref=e21]:
        - heading "Apex Store" [level=1] [ref=e22]
        - paragraph [ref=e23]: A modern multi-channel white-label e-commerce storefront & POS platform.
      - generic [ref=e25]:
        - button "All Products" [ref=e26]
        - button "Accessories" [ref=e27]
        - button "Clothing" [ref=e28]
        - button "Electronics" [ref=e29]
        - button "Food & Drinks" [ref=e30]
      - generic [ref=e32]:
        - article [ref=e33]:
          - link "Wireless Earbuds Electronics" [ref=e34] [cursor=pointer]:
            - /url: /store/wireless-earbuds
            - img "Wireless Earbuds" [ref=e35]
            - generic [ref=e36]: Electronics
          - generic [ref=e37]:
            - heading [level=3] [ref=e38]:
              - link "Wireless Earbuds" [ref=e39] [cursor=pointer]:
                - /url: /store/wireless-earbuds
            - generic [ref=e40]:
              - generic [ref=e41]: $49.99
              - generic [ref=e42]: per item
            - generic [ref=e43]: In Stock
            - button "Add to Cart" [ref=e48]
        - article [ref=e55]:
          - link "Premium Hoodie Clothing" [ref=e56] [cursor=pointer]:
            - /url: /store/premium-hoodie
            - img "Premium Hoodie" [ref=e57]
            - generic [ref=e58]: Clothing
          - generic [ref=e59]:
            - heading [level=3] [ref=e60]:
              - link "Premium Hoodie" [ref=e61] [cursor=pointer]:
                - /url: /store/premium-hoodie
            - generic [ref=e62]:
              - generic [ref=e63]: $34.99
              - generic [ref=e64]: per item
            - generic [ref=e65]: In Stock
            - button "Add to Cart" [ref=e70]
        - article [ref=e77]:
          - link "Leather Wallet Accessories" [ref=e78] [cursor=pointer]:
            - /url: /store/leather-wallet
            - img "Leather Wallet" [ref=e79]
            - generic [ref=e80]: Accessories
          - generic [ref=e81]:
            - heading [level=3] [ref=e82]:
              - link "Leather Wallet" [ref=e83] [cursor=pointer]:
                - /url: /store/leather-wallet
            - generic [ref=e84]:
              - generic [ref=e85]: $19.99
              - generic [ref=e86]: per item
            - generic [ref=e87]: In Stock
            - button "Add to Cart" [ref=e92]
        - article [ref=e99]:
          - link "Organic Coffee Beans Food & Drinks" [ref=e100] [cursor=pointer]:
            - /url: /store/organic-coffee-beans
            - img "Organic Coffee Beans" [ref=e101]
            - generic [ref=e102]: Food & Drinks
          - generic [ref=e103]:
            - heading [level=3] [ref=e104]:
              - link "Organic Coffee Beans" [ref=e105] [cursor=pointer]:
                - /url: /store/organic-coffee-beans
            - generic [ref=e106]:
              - generic [ref=e107]: $12.99
              - generic [ref=e108]: per item
            - generic [ref=e109]: In Stock
            - button "Add to Cart" [ref=e114]
        - article [ref=e121]:
          - link "Smart Watch Electronics" [ref=e122] [cursor=pointer]:
            - /url: /store/smart-watch
            - img "Smart Watch" [ref=e123]
            - generic [ref=e124]: Electronics
          - generic [ref=e125]:
            - heading [level=3] [ref=e126]:
              - link "Smart Watch" [ref=e127] [cursor=pointer]:
                - /url: /store/smart-watch
            - generic [ref=e128]:
              - generic [ref=e129]: $89.99
              - generic [ref=e130]: per item
            - generic [ref=e131]: In Stock
            - button "Add to Cart" [ref=e136]
        - article [ref=e143]:
          - link "Running Shoes Clothing" [ref=e144] [cursor=pointer]:
            - /url: /store/running-shoes
            - img "Running Shoes" [ref=e145]
            - generic [ref=e146]: Clothing
          - generic [ref=e147]:
            - heading [level=3] [ref=e148]:
              - link "Running Shoes" [ref=e149] [cursor=pointer]:
                - /url: /store/running-shoes
            - generic [ref=e150]:
              - generic [ref=e151]: $59.99
              - generic [ref=e152]: per item
            - generic [ref=e153]: In Stock
            - button "Add to Cart" [ref=e158]
    - contentinfo [ref=e165]:
      - generic [ref=e166]:
        - generic [ref=e167]:
          - generic [ref=e168]:
            - heading "Apex" [level=3] [ref=e169]
            - paragraph [ref=e170]: A modern multi-channel white-label e-commerce storefront & POS platform.
            - generic [ref=e171]:
              - link "facebook" [ref=e172] [cursor=pointer]:
                - /url: https://facebook.com
              - link "instagram" [ref=e173] [cursor=pointer]:
                - /url: https://instagram.com
              - link "twitter" [ref=e174] [cursor=pointer]:
                - /url: https://x.com
              - link "tiktok" [ref=e175] [cursor=pointer]:
                - /url: https://tiktok.com
          - generic [ref=e176]:
            - heading "Contact" [level=4] [ref=e177]
            - list [ref=e178]:
              - listitem [ref=e179]: "Email: support@example.com"
              - listitem [ref=e180]: "Phone: +1 (800) 555-0199"
              - listitem [ref=e181]: "WhatsApp: +18005550199"
              - listitem [ref=e182]: "Address: 123 Commerce Way, Suite 400, New York, United States"
          - generic [ref=e183]:
            - heading "Payment Methods" [level=4] [ref=e184]
            - generic [ref=e185]:
              - generic [ref=e186]: Stripe
              - generic [ref=e187]: PayPal
              - generic [ref=e188]: COD
              - generic [ref=e189]: Bank Transfer
        - generic [ref=e190]: © 2026 Apex Store. All rights reserved.
  - alert [ref=e191]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Live Flow — Admin → Storefront → Cart → Stripe', () => {
  4  |   test('Admin Product Upload & Storefront Discovery', async ({ page }) => {
  5  |     // Phase 2.1 — Admin Product Creation
  6  |     await page.goto('https://website-template-lovat-nine.vercel.app/admin/products');
  7  |     await expect(page.locator('h1, h2, text=Admin')).toBeVisible();
  8  | 
  9  |     // Fill Add Product form
  10 |     await page.fill('input[name="name"], input[placeholder*="Name"], input[type="text"]', 'Playwright Automated Smartwatch');
  11 |     await page.fill('input[name="price"], input[placeholder*="Price"], input[type="number"]', '49.99');
  12 |     await page.fill('textarea[name="description"], textarea', 'Automated end-to-end test item generated by Playwright.');
  13 | 
  14 |     // Submit and verify no 500
  15 |     await page.click('button[type="submit"], button:has-text("Add")');
  16 |     await expect(page.locator('text=Success, text=Product created, text=Added')).toBeVisible({ timeout: 10000 }).catch(() => {
  17 |       // If success message not present, verify table updated instead
  18 |       expect(page.locator('text=Playwright Automated Smartwatch')).toBeVisible({ timeout: 8000 });
  19 |     });
  20 | 
  21 |     // Phase 2.2 — Storefront Discovery
  22 |     await page.goto('https://website-template-lovat-nine.vercel.app/');
  23 |     await expect(page.locator('text=$49.99')).toBeVisible({ timeout: 10000 });
  24 |     await expect(page.locator('text=Playwright Automated Smartwatch')).toBeVisible({ timeout: 10000 });
  25 | 
  26 |     // Click product to detail
  27 |     await page.locator('a', { hasText: 'Playwright Automated Smartwatch' }).first().click();
  28 |     await expect(page).toHaveURL(/store\/playwright-automated-smartwatch/);
  29 | 
  30 |     // Phase 2.3 — Cart & Quantity
  31 |     await page.locator('button:has-text("Add to Cart"), button:has-text("Add")').click();
  32 |     await page.goto('https://website-template-lovat-nine.vercel.app/cart');
  33 |     await expect(page.locator('text=Playwright Automated Smartwatch')).toBeVisible();
  34 |     await expect(page.locator('text=$49.99')).toBeVisible();
  35 | 
  36 |     // Increase quantity to 2
  37 |     await page.locator('button:has-text("+"), button[aria-label="increase"]').click();
  38 |     await expect(page.locator('text=$99.98')).toBeVisible({ timeout: 5000 });
  39 |   });
  40 | 
  41 |   test('Mobile Viewport Responsive Audit', async ({ page }) => {
  42 |     await page.setViewportSize({ width: 375, height: 667 });
  43 |     await page.goto('https://website-template-lovat-nine.vercel.app/');
> 44 |     await expect(page.locator('nav, header, button')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  45 |     await page.goto('https://website-template-lovat-nine.vercel.app/admin');
  46 |     await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  47 |     await page.goto('https://website-template-lovat-nine.vercel.app/cart');
  48 |     await expect(page.locator('text=Your Cart, text=Subtotal')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('Stripe Checkout Intercept & Webhook', async ({ page }) => {
  52 |     // Add item to cart first
  53 |     await page.goto('https://website-template-lovat-nine.vercel.app/');
  54 |     await page.locator('button:has-text("Add to Cart")').first().click();
  55 |     await page.goto('https://website-template-lovat-nine.vercel.app/cart');
  56 | 
  57 |     // Intercept checkout request
  58 |     const checkoutResponse = await page.waitForResponse(resp =>
  59 |       resp.url().includes('/api/checkout') && resp.status() === 200 || resp.status() === 302,
  60 |       { timeout: 10000 }
  61 |     ).catch(() => null);
  62 | 
  63 |     expect(checkoutResponse).not.toBeNull();
  64 |   });
  65 | });
  66 | 
```