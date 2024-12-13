import { configureStore } from '@reduxjs/toolkit';
import {
  fetchOrders,
  createOrder,
  fetchOrderNumber,
  initialState,
  orderSlice,
  resetOrderData,
  TOrderState
} from '../slices/orderSlice';
import {
  TOrder,
  TNewOrderResponse,
  TOrderResponse
} from '../../utils/burger-api';

describe('Тесты для редьюсера слайса order', () => {
  const mockOrderData: TOrder[] = [
    {
      _id: '1',
      name: 'Order 1',
      status: 'completed',
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    }
  ];

  const mockSuccessOrder: TNewOrderResponse = {
    success: true,
    order: {
      _id: '2',
      name: 'Order 2',
      status: 'pending',
      createdAt: '2024-12-02',
      updatedAt: '2024-12-02',
      number: 2,
      ingredients: ['ingredient3', 'ingredient4']
    },
    name: 'Order 2'
  };

  const mockOrderInfoData: TOrderResponse = {
    success: true,
    orders: [
      {
        _id: '3',
        name: 'Order 3',
        status: 'in-progress',
        createdAt: '2024-12-03',
        updatedAt: '2024-12-03',
        number: 3,
        ingredients: ['ingredient5', 'ingredient6']
      }
    ]
  };

  describe('Проверка синхронных экшенов', () => {
    it('Проверка экшена очистки данных заказа - resetOrderData', () => {
      const state = orderSlice.reducer(initialState, resetOrderData());
      expect(state).toEqual(initialState);
    });
  });

  describe('Проверка асинхронных экшенов', () => {
    describe('Проверка экшена получения заказов - fetchOrders', () => {
      it('Проверка при вызове экшена Request', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrders.pending.type
        });
        expect(state.orderRequest).toBe(true);
      });

      it('Проверка при вызове экшена Success', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrders.fulfilled.type,
          payload: mockOrderData
        });
        expect(state.orderRequest).toBe(false);
        expect(state.ordersHistory).toEqual(mockOrderData);
      });

      it('Проверка при вызове экшена Failed', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrders.rejected.type,
          error: { name: 'Test error', message: 'Error fetching orders' }
        });
        expect(state.orderRequest).toBe(false);
        expect(state.orderError).toEqual({
          name: 'Test error',
          message: 'Error fetching orders'
        });
      });
    });

    describe('Проверка экшена создания заказа - createOrder', () => {
      it('Проверка при вызове экшена Request', () => {
        const state = orderSlice.reducer(initialState, {
          type: createOrder.pending.type
        });
        expect(state.orderRequest).toBe(true);
      });

      it('Проверка при вызове экшена Success', () => {
        const state = orderSlice.reducer(initialState, {
          type: createOrder.fulfilled.type,
          payload: mockSuccessOrder
        });
        expect(state.orderRequest).toBe(false);
        expect(state.successedOrder).toEqual(mockSuccessOrder);
      });

      it('Проверка при вызове экшена Failed', () => {
        const state = orderSlice.reducer(initialState, {
          type: createOrder.rejected.type,
          error: { name: 'Test error', message: 'Error creating order' }
        });
        expect(state.orderRequest).toBe(false);
        expect(state.orderError).toEqual({
          name: 'Test error',
          message: 'Error creating order'
        });
      });
    });

    describe('Проверка экшена получения заказа по номеру - fetchOrderNumber', () => {
      it('Проверка при вызове экшена Request', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrderNumber.pending.type
        });
        expect(state.orderRequest).toBe(true);
      });

      it('Проверка при вызове экшена Success', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrderNumber.fulfilled.type,
          payload: mockOrderInfoData
        });
        expect(state.orderRequest).toBe(false);
        expect(state.orderInfoData).toEqual(mockOrderInfoData);
      });

      it('Проверка при вызове экшена Failed', () => {
        const state = orderSlice.reducer(initialState, {
          type: fetchOrderNumber.rejected.type,
          error: {
            name: 'Test error',
            message: 'Error fetching order by number'
          }
        });
        expect(state.orderRequest).toBe(false);
        expect(state.orderError).toEqual({
          name: 'Test error',
          message: 'Error fetching order by number'
        });
      });
    });
  });

  describe('Проверка селекторов', () => {
    const store = configureStore({
      reducer: {
        order: orderSlice.reducer
      },
      preloadedState: {
        order: initialState
      }
    });

    it('Проверка селектора получения истории заказов', () => {
      const ordersHistory = store.getState().order.ordersHistory;
      expect(ordersHistory).toEqual(initialState.ordersHistory);
    });

    it('Проверка селектора получения статуса загрузки', () => {
      const orderRequest = store.getState().order.orderRequest;
      expect(orderRequest).toBe(false);
    });

    it('Проверка селектора получения информации успешного заказа', () => {
      const successedOrder = store.getState().order.successedOrder?.order;
      expect(successedOrder).toEqual(initialState.successedOrder?.order);
    });

    it('Проверка селектора получения информации заказа по номеру', () => {
      const orderInfoData = store.getState().order.orderInfoData?.orders[0];
      expect(orderInfoData).toEqual(initialState.orderInfoData?.orders[0]);
    });
  });
});
