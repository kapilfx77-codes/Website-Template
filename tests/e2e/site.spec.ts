import { test, expect } from '@playwright/test';

test('Home & Product Navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=$49.99')).toBeVisible();
  await page.locator('a[href="/store/wireless-earbuds"]').first().click();
  await expect(page).toHaveURL(/\/store\/wireless-earbuds/);
});

test('Cart & Checkout Flow', async ({ page }) => {
  await page.goto('/');
  await page.locator('button:has-text("Add to Cart")').first().click();
  await page.goto('/cart');
  await expect(page.locator('text=Your Cart')).toBeVisible();
});

test('Admin Dashboard & Mutation', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  await page.locator('a[href="/admin/products"]').click();
  await expect(page).toHaveURL(/\/admin\/products/);
});
