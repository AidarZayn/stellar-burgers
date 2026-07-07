import {
  constructorSlice,
  initialState,
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} from './burger-constructor';
import { TIngredient } from '@utils-types';

describe('редьюсер burgerConstructor', () => {
  const bun: TIngredient = {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 400,
    price: 500,
    image: 'image_url',
    image_mobile: 'image_mobile_url',
    image_large: 'image_large_url'
  };

  const filling1: TIngredient = {
    _id: '2',
    name: 'Тестовая начинка 1',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 15,
    calories: 200,
    price: 100,
    image: 'image_url_1',
    image_mobile: 'image_mobile_url_1',
    image_large: 'image_large_url_1'
  };

  const filling2: TIngredient = {
    _id: '3',
    name: 'Тестовая начинка 2',
    type: 'main',
    proteins: 30,
    fat: 15,
    carbohydrates: 10,
    calories: 250,
    price: 150,
    image: 'image_url_2',
    image_mobile: 'image_mobile_url_2',
    image_large: 'image_large_url_2'
  };

  test('должен вернуть начальное состояние, если состояние undefined и экшен неизвестный', () => {
    const result = constructorSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен добавить булку в bun', () => {
    const action = addIngredient(bun);
    const result = constructorSlice.reducer(initialState, action);

    expect(result.bun).toEqual({
      ...bun,
      id: action.payload.id
    });
    expect(result.ingredients).toEqual([]);
  });

  test('должен добавить начинку в ingredients', () => {
    const action = addIngredient(filling1);
    const result = constructorSlice.reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([
      {
        ...filling1,
        id: action.payload.id
      }
    ]);
  });

  test('должен удалить ингредиент по id', () => {
    const firstAction = addIngredient(filling1);
    const secondAction = addIngredient(filling2);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      deleteIngredient({
        ...stateWithIngredients.ingredients[0]
      })
    );

    expect(result.ingredients).toEqual([
      {
        ...filling2,
        id: secondAction.payload.id
      }
    ]);
  });

  test('должен поменять ингредиенты местами вверх', () => {
    const firstAction = addIngredient(filling1);
    const secondAction = addIngredient(filling2);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredientUp(1)
    );

    expect(result.ingredients[0].name).toBe('Тестовая начинка 2');
    expect(result.ingredients[1].name).toBe('Тестовая начинка 1');
  });

  test('должен поменять ингредиенты местами вниз', () => {
    const firstAction = addIngredient(filling1);
    const secondAction = addIngredient(filling2);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredientDown(0)
    );

    expect(result.ingredients[0].name).toBe('Тестовая начинка 2');
    expect(result.ingredients[1].name).toBe('Тестовая начинка 1');
  });

  test('должен сбросить состояние', () => {
    const stateWithData = {
      bun: {
        ...bun,
        id: 'tests-id'
      },
      ingredients: [
        {
          ...filling1,
          id: 'tests-id-1'
        }
      ],
      orderRequest: true,
      orderModalData: null,
      error: 'error'
    };

    const result = constructorSlice.reducer(stateWithData, resetConstructor());

    expect(result).toEqual(initialState);
  });
});
