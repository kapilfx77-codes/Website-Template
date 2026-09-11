# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\site.spec.ts >> Admin Dashboard & Mutation
- Location: tests\e2e\site.spec.ts:17:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/admin", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Home & Product Navigation', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await expect(page.locator('text=$49.99')).toBeVisible();
  6  |   await page.locator('a[href="/store/wireless-earbuds"]').first().click();
  7  |   await expect(page).toHaveURL(/\/store\/wireless-earbuds/);
  8  | });
  9  | 
  10 | test('Cart & Checkout Flow', async ({ page }) => {
  11 |   await page.goto('/');
  12 |   await page.locator('button:has-text("Add to Cart")').first().click();
  13 |   await page.goto('/cart');
  14 |   await expect(page.locator('text=Your Cart')).toBeVisible();
  15 | });
  16 | 
  17 | test('Admin Dashboard & Mutation', async ({ page }) => {
> 18 |   await page.goto('/admin');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  19 |   await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  20 |   await page.locator('a[href="/admin/products"]').click();
  21 |   await expect(page).toHaveURL(/\/admin\/products/);
  22 | });
  23 | 
```