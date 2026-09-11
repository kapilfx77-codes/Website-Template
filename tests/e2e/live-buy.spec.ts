import { test, expect } from '@playwright/test';

test('Live Store — Create Product and Buy', async ({ page }) => {
  // 1. Create on live admin
  await page.goto('https://website-template-lovat-nine.vercel.app/admin/products');
  await page.getByRole('button', { name: /\+ Product/i }).click();

  await page.getByLabel(/name/i).fill('Live Test Smartwatch');
  await page.getByLabel(/price/i).fill('49.99');

  // Description field may be optional / not labeled — skip if missing
  await page.locator('textarea').fill('Created live and bought live.').catch(() => {});

  await page.getByRole('button', { name: /add product/i }).click();

  // Wait for revalidation
  await page.waitForTimeout(2000);

  // 2. Verify on storefront
  await page.goto('https://website-template-lovat-nine.vercel.app/');
  await expect(page.locator('text=Live Test Smartwatch')).toBeVisible();
  await expect(page.locator('text=$49.99')).toBeVisible();

  // 3. Buy it
  await page.locator('text=Live Test Smartwatch').click();
  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.goto('https://website-template-lovat-nine.vercel.app/cart');
  await expect(page.locator('text=Live Test Smartwatch')).toBeVisible();
  await expect(page.locator('text=$49.99')).toBeVisible();
});
