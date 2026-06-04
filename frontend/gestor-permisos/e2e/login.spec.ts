import { test, expect } from '@playwright/test';

test('login com admin i redirigeix al dashboard', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  await page.locator('input[formControlName="usuari"]').fill('admin@test.com');
  await page.locator('input[formControlName="password"]').fill('Admin1234!');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await expect(page).toHaveURL(/dashboard/);
});

test('login amb credencials incorrectes mostra error', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  await page.locator('input[formControlName="usuari"]').fill('usuari_fals');
  await page.locator('input[formControlName="password"]').fill('password_fals');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.locator('.alert')).toBeVisible({ timeout: 5000 });
});

test('redirigeix a login si no autenticat', async ({ page }) => {
  await page.goto('http://localhost:4200/dashboard');
  await page.waitForURL('**/login', { timeout: 5000 });
  await expect(page).toHaveURL(/login/);
});
