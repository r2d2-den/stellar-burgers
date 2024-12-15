import {
  addIngredient,
  constructorIngredients,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} from '../slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

describe('Редьюсеры конструктора ингредиентов', () => {
  const ingredient: TConstructorIngredient = {
    id: uuidv4(),
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  const ingredient2: TConstructorIngredient = {
    id: uuidv4(),
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус Sweet',
    type: 'sauce',
    proteins: 15,
    fat: 10,
    carbohydrates: 25,
    calories: 20,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sweet-sauce.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/sweet-sauce-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sweet-sauce-large.png'
  };

  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: [ingredient, ingredient2]
    }
  };

  let store = configureStore({
    reducer: {
      constructorIngredients: constructorIngredients.reducer
    },
    preloadedState: {
      constructorIngredients: initialState
    }
  });

  beforeEach(() => {
    store = configureStore({
      reducer: {
        constructorIngredients: constructorIngredients.reducer
      },
      preloadedState: {
        constructorIngredients: initialState
      }
    });
  });

  it('должен добавить ингредиент', () => {
    store.dispatch(addIngredient(ingredient));

    const state = store.getState().constructorIngredients.constructorItems;
    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[2]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: ingredient.name,
        type: ingredient.type
      })
    );
  });

  it('должен удалять ингредиент', () => {
    store.dispatch(removeIngredient(ingredient.id));

    const state = store.getState().constructorIngredients.constructorItems;
    const removedIngredient = state.ingredients.find(
      (i) => i.id === ingredient.id
    );
    expect(removedIngredient).toBeUndefined();
  });

  it('должен переместить ингредиент вверх', () => {
    store.dispatch(moveIngredientUp(ingredient2.id));

    const state = store.getState().constructorIngredients.constructorItems;
    expect(state.ingredients[0].id).toBe(ingredient2.id);
    expect(state.ingredients[1].id).toBe(ingredient.id);
  });

  it('должен переместить ингредиент вниз', () => {
    store.dispatch(moveIngredientDown(ingredient.id));

    const state = store.getState().constructorIngredients.constructorItems;
    expect(state.ingredients[1].id).toBe(ingredient.id);
    expect(state.ingredients[0].id).toBe(ingredient2.id);
  });
});
