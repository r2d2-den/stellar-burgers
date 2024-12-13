import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';

it('Инициализация rootReducer успешна', () => {
  const store = configureStore({
    reducer: rootReducer
  });

  const action = { type: 'UNKNOWN_ACTION' };
  const testState = rootReducer(undefined, action);
  expect(testState).toEqual(store.getState());
});
