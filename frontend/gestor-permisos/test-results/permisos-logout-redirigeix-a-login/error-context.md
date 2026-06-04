# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: permisos.spec.ts >> logout redirigeix a login
- Location: e2e\permisos.spec.ts:28:5

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button', { name: 'Tancar sessio' })

```

# Test source

```ts
  1  | ﻿import { test, expect } from '@playwright/test';
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   await page.goto('http://localhost:4200/login');
  5  |   await page.locator('input[formControlName="usuari"]').fill('admin@test.com');
  6  |   await page.locator('input[formControlName="password"]').fill('Admin1234!');
  7  |   await page.getByRole('button', { name: 'Entrar' }).click();
  8  |   await page.waitForURL('**/dashboard', { timeout: 10000 });
  9  | });
  10 | 
  11 | test('crear un permis nou', async ({ page }) => {
  12 |   await page.goto('http://localhost:4200/permisos');
  13 |   await page.locator('#dataInici').fill('2026-07-01');
  14 |   await page.locator('#dataFinal').fill('2026-07-05');
  15 |   await page.locator('#tipus').selectOption('malaltia');
  16 |   await page.locator('#descripcio').fill('Prova E2E Playwright');
  17 |   await page.getByRole('button', { name: 'Guardar' }).click();
  18 |   await expect(page.getByText('Prova E2E Playwright')).toBeVisible({ timeout: 5000 });
  19 | });
  20 | 
  21 | test('filtrar permisos per estat pendent', async ({ page }) => {
  22 |   await page.goto('http://localhost:4200/permisos');
  23 |   await page.locator('#filtreEstat').selectOption('pendent');
  24 |   await page.waitForTimeout(500);
  25 |   await expect(page.locator('#filtreEstat')).toHaveValue('pendent');
  26 | });
  27 | 
  28 | test('logout redirigeix a login', async ({ page }) => {
> 29 |   await page.getByRole('button', { name: 'Tancar sessio' }).click();
     |                                                             ^ Error: locator.click: Target page, context or browser has been closed
  30 |   await expect(page).toHaveURL(/login/);
  31 | });
  32 | 
```