import { test, expect } from '@playwright/test';

test.describe('Провожу тест модального окна ингредиента', () => {
  test('Проверяем, что есть ингредиенты, далее откроем модальное окно, закроем его кнопкой на крестик, потом откроем снова и закроем уже кликом на фон', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();

    const ingredient = page.getByTestId('643d69a5c3f7b9001cfa093c');

    await expect(ingredient).toBeVisible();
    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await expect(page.getByTestId('modal')).toContainText(
      'Краторная булка N-200i'
    );

    await page.getByTestId('close-modal').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(ingredient).toBeVisible();
    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(ingredient).toBeVisible();
    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
