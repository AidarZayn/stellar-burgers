import { test, expect } from '@playwright/test';

test.describe('Список ингредиентов с HAR', () => {
  test('Записываем HAR файл ингредиентов', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('должен загрузить ингредиенты из HAR-файла', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('loading-ingredients')).not.toBeVisible();

    const list = page.getByTestId('ingredients-list');
    await expect(list).toBeVisible();

    // Проверяем конкретные ингредиенты
    await expect(page.getByTestId('643d69a5c3f7b9001cfa093c')).toBeVisible();
    await expect(page.getByTestId('643d69a5c3f7b9001cfa0941')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('должен работать без реального сервера', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/ingredients'
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('должен добавить булочку и проверить, что она выбралась', async ({
    page
  }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    // Открываем главную страницу
    await page.goto('/');

    // Кликаем на "Добавить"
    await page
      .getByTestId('643d69a5c3f7b9001cfa093c')
      .getByRole('button', { name: /Добавить/i })
      .click();
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i (верх)'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i (низ)'
    );
  });
});
