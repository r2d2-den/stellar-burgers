import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TConstructorState = {
  constructorItems: TConstructorItems;
};

export const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

// Упрощенная функция для обмена местами элементов массива
const moveElementsInArray = <T>(
  array: T[],
  index1: number,
  index2: number
): T[] => {
  if (
    index1 < 0 ||
    index2 < 0 ||
    index1 >= array.length ||
    index2 >= array.length
  )
    return array;

  [array[index1], array[index2]] = [array[index2], array[index1]]; // деструктуризация для обмена
  return [...array]; // Возвращаем новый массив
};

// Универсальная функция для перемещения ингредиентов вверх или вниз
const moveIngredient = (
  state: TConstructorState,
  ingredientId: string,
  direction: 'up' | 'down'
) => {
  const ingredients = state.constructorItems.ingredients;
  const index = ingredients.findIndex(
    (ingredient) => ingredient.id === ingredientId
  );

  if (index === -1) return; // Ингредиент не найден, выходим

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex >= 0 && newIndex < ingredients.length) {
    state.constructorItems.ingredients = moveElementsInArray(
      ingredients,
      index,
      newIndex
    );
  }
};

export const constructorIngredients = createSlice({
  name: 'constructorIngredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient; // Если булочка, добавляем как единственную
        } else {
          state.constructorItems.ingredients.push(ingredient); // Добавляем ингредиент в список
        }
      },
      prepare: (ingredient: TConstructorIngredient) => {
        const id = uuidv4(); // Генерируем уникальный id для ингредиента
        return {
          payload: {
            ...ingredient,
            id
          }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      // Удаляем ингредиент по id
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      moveIngredient(state, action.payload, 'up'); // Перемещаем ингредиент вверх
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      moveIngredient(state, action.payload, 'down'); // Перемещаем ингредиент вниз
    },
    resetConstructorOrder: () => initialState // Сбрасываем состояние конструктора
  }
});

export const selectConstructorItems = (state: {
  constructorIngredients: TConstructorState;
}) => state.constructorIngredients.constructorItems;

export const {
  addIngredient,
  resetConstructorOrder,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} = constructorIngredients.actions;

export default constructorIngredients.reducer;
