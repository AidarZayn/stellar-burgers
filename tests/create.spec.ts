import { test, expect } from '@playwright/test';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ context, page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await context.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await context.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    console.log(await page.context().cookies());

    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('Создание заказа с авторизованным пользователем', async ({ page }) => {
    // Добавляем булку
    await page
      .getByTestId('643d69a5c3f7b9001cfa093c')
      .getByRole('button', { name: /Добавить/i })
      .click();

    // Проверяем, что булка появилась в конструкторе
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i (верх)'
    );

    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i (низ)'
    );

    // Нажимаем "Оформить заказ"
    await page.getByTestId('create-order').click();

    console.log(await page.url());

    // Проверяем, что модальное окно открылось
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 5000 });

    // Проверяем, что номер заказа верный
    await expect(page.getByTestId('order-number')).toContainText('12345');

    // Проверяем, что конструктор пуст
    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();

    // Закрываем модальное окно
    await page.getByTestId('close-modal').click();

    // Проверяем успешность закрытия
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
