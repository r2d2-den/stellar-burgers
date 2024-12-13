import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { getIngredientsApi } from '../../utils/burger-api';

export type TIngredientsState = {
  data: TIngredient[];
  loading: boolean;
  error: SerializedError | null;
};

export const initialState: TIngredientsState = {
  data: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.data;

export const selectLoadingIngredients = (state: RootState) =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
