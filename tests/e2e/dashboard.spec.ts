import { test, expect } from '@playwright/test';

test('login and navigate to command center', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'demo@veltrix.ai');
  await page.fill('input[type="password"]', 'veltrix2026');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toContainText('Command Center');
});
