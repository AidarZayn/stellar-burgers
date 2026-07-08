import { test, expect } from '@playwright/test';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();

    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Мок для ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    // Мок для данных пользователя
    await page.route('**/auth/user', async (route) => {
      const mockUser = {
        success: true,
        user: {
          email: 'tests@tests.com',
          name: 'Test User'
        }
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser)
      });
    });

    // Мок для создания заказа
    await page.route('**/orders', async (route) => {
      const mockOrder = {
        success: true,
        name: 'Space burger',
        order: {
          number: 12345
        }
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      });
    });

    // Подставляем токен авторизации в cookie (как делает приложение)
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'tests-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    // Также refreshToken в localStorage
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'tests-refresh-token');
    });

    await page.goto('/');

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
