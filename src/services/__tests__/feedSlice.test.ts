import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, fetchAllFeeds, initialState } from '../slices/feedSlice';
import { RootState } from '../../services/store';
import { TOrder } from '@utils-types';

describe('Тестирование слайса feed', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedSlice.reducer
      },
      preloadedState: {
        feed: initialState
      }
    });
  });

  it('При вызове fetchAllFeeds.pending loading меняется на true', () => {
    store.dispatch(fetchAllFeeds.pending(''));
    const state = store.getState() as RootState;
    expect(state.feed.loading).toBe(true);
    expect(state.feed.error).toBeNull();
  });

  it('При вызове fetchAllFeeds.fulfilled данные сохраняются в store и loading меняется на false', () => {
    const mockData = {
      success: true,
      orders: [
        {
          _id: 'order1',
          status: 'created',
          name: 'Order 1',
          createdAt: '2024-12-07T10:00:00Z',
          updatedAt: '2024-12-07T10:05:00Z',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 1,
      totalToday: 1
    };

    store.dispatch(fetchAllFeeds.fulfilled(mockData, 'fetchAllFeeds'));
    const state = store.getState() as RootState;
    expect(state.feed.loading).toBe(false);
    expect(state.feed.feedData).toEqual(mockData);
  });

  it('При вызове fetchAllFeeds.rejected ошибка сохраняется в store и loading меняется на false', () => {
    const error = { name: 'Test Error', message: 'An error occurred' };
    store.dispatch(fetchAllFeeds.rejected(error, 'fetchAllFeeds'));
    const state = store.getState() as RootState;
    expect(state.feed.loading).toBe(false);
    expect(state.feed.error).toEqual(error);
  });

  it('Селектор selectFeedOrders должен вернуть правильные данные', () => {
    const mockData = {
      success: true,
      orders: [
        {
          _id: 'order1',
          status: 'created',
          name: 'Order 1',
          createdAt: '2024-12-07T10:00:00Z',
          updatedAt: '2024-12-07T10:05:00Z',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 1,
      totalToday: 1
    };

    store.dispatch(fetchAllFeeds.fulfilled(mockData, 'fetchAllFeeds'));
    const orders: TOrder[] = (store.getState() as RootState).feed.feedData
      .orders;
    expect(orders).toEqual(mockData.orders);
  });

  it('Селектор selectFeedLoading должен вернуть правильное значение', () => {
    store.dispatch(fetchAllFeeds.pending(''));
    const loading = (store.getState() as RootState).feed.loading;
    expect(loading).toBe(true);
  });

  it('Селектор selectFeedError должен вернуть правильное значение ошибки', () => {
    const error = { name: 'Test Error', message: 'An error occurred' };
    store.dispatch(fetchAllFeeds.rejected(error, 'fetchAllFeeds'));
    const feedError = (store.getState() as RootState).feed.error;
    expect(feedError).toEqual(error);
  });
});
