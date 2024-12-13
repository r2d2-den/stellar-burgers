import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '../../utils/burger-api';

import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TNewOrderResponse,
  TOrderResponse
} from '../../utils/burger-api';
import { RootState } from '../store';

export type TOrderState = {
  ordersHistory: TOrder[];
  successedOrder: TNewOrderResponse | null;
  orderInfoData: TOrderResponse | null;
  orderRequest: boolean;
  orderError: SerializedError | null;
};

export const initialState: TOrderState = {
  ordersHistory: [],
  successedOrder: null,
  orderInfoData: null,
  orderRequest: false,
  orderError: null
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'order/getOrders',
  getOrdersApi
);

export const createOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  'order/postOrder',
  orderBurgerApi
);

export const fetchOrderNumber = createAsyncThunk<TOrderResponse, number>(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderData: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.ordersHistory = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      });

    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.successedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      });

    builder
      .addCase(fetchOrderNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(fetchOrderNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderInfoData = action.payload;
      })
      .addCase(fetchOrderNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      });
  }
});

export const selectOrdersHistory = (state: RootState) =>
  state.order.ordersHistory;

export const selectOrderRequestStatus = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.successedOrder?.order;

export const selectOrderNumber = (state: RootState) =>
  state.order.orderInfoData?.orders[0];

export const { resetOrderData } = orderSlice.actions;

export default orderSlice.reducer;
