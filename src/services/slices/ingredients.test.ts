import {
  ingredientsSlice,
  initialState,
  fetchIngredients
} from './ingredients';
import { TIngredient } from '@utils-types';

describe('редьюсер ingredientsSlice', () => {
  const ingredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    }
  ];
  test('должен вернуть начальное состояние, если состояние undefined и экшен неизвестный', () => {
    const result = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual(initialState);
  });

  test('должен обработать экшен fetchIngredients.pending', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('должен обработать экшен fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };

    const result = ingredientsSlice.reducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки'
    });
  });

  test('должен обработать экшен fetchIngredients.fulfilled', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(ingredients, '')
    );

    expect(result).toEqual({
      ...initialState,
      loading: false,
      ingredients
    });
  });
});
