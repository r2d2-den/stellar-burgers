import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';

describe('Тестирование слайса ingredients', () => {
  let store: ReturnType<typeof configureStore>;

  const ingredient: TIngredient = {
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

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredients: initialState
      }
    });
  });

  it('При вызове fetchIngredients.pending isLoading меняется на true', () => {
    store.dispatch(fetchIngredients.pending(''));
    const state = store.getState() as RootState;
    expect(state.ingredients.loading).toBe(true);
  });

  it('При вызове fetchIngredients.fulfilled данные сохраняются в store, и isLoading меняется на false', () => {
    store.dispatch(
      fetchIngredients.fulfilled([ingredient], 'fetchIngredients')
    );
    const state = store.getState() as RootState;
    expect(state.ingredients.data).toEqual([ingredient]);
    expect(state.ingredients.loading).toBe(false);
  });

  it('При вызове fetchIngredients.rejected ошибка сохраняется в store, и isLoading меняется на false', () => {
    const error = new Error('Ошибка при загрузке данных');
    store.dispatch(fetchIngredients.rejected(error, 'fetchIngredients'));
    const state = store.getState() as RootState;
    expect(state.ingredients.error?.message).toEqual(error.message);
    expect(state.ingredients.loading).toBe(false);
  });
});
