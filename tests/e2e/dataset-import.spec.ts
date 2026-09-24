import { test, expect } from '@playwright/test';

test('dataset manager view opens modal', async ({ page }) => {
  await page.goto('/datasets');
  await page.click('text=Add Dataset');
  await expect(page.locator('text=Import Dataset')).toBeVisible();
});
