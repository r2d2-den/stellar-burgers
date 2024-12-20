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
  ) {
    return array;
  }
  const tmp = array[index1];
  array[index1] = array[index2];
  array[index2] = tmp;
  return array;
};

export const constructorIngredients = createSlice({
  name: 'constructorIngredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type !== 'bun') {
          state.constructorItems.ingredients.push(ingredient);
        } else {
          state.constructorItems.bun = ingredient;
        }
      },
      prepare: (ingredient: TConstructorIngredient) => {
        const id = uuidv4();
        return {
          payload: {
            ...ingredient,
            id
          }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index > 0) {
        state.constructorItems.ingredients = moveElementsInArray(
          state.constructorItems.ingredients,
          index,
          index - 1
        );
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        state.constructorItems.ingredients = moveElementsInArray(
          state.constructorItems.ingredients,
          index,
          index + 1
        );
      }
    },
    resetConstructorOrder: () => initialState
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
