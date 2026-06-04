import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.locator('input[formControlName="usuari"]').fill('admin@test.com');
  await page.locator('input[formControlName="password"]').fill('Admin1234!');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 10000 });
});

test('crear un permis nou', async ({ page }) => {
  await page.goto('http://localhost:4200/permisos');
  await page.locator('#dataInici').fill('2026-07-01');
  await page.locator('#dataFinal').fill('2026-07-05');
  await page.locator('#tipus').selectOption('malaltia');
  await page.locator('#descripcio').fill('Prova E2E Playwright');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Prova E2E Playwright')).toBeVisible({ timeout: 5000 });
});

test('filtrar permisos per estat pendent', async ({ page }) => {
  await page.goto('http://localhost:4200/permisos');
  await page.locator('#filtreEstat').selectOption('pendent');
  await page.waitForTimeout(500);
  await expect(page.locator('#filtreEstat')).toHaveValue('pendent');
});

test('logout redirigeix a login', async ({ page }) => {
  await page.getByRole('button', { name: 'Tancar sessio' }).click();
  await expect(page).toHaveURL(/login/);
});
