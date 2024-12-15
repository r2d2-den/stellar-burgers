import { configureStore } from '@reduxjs/toolkit';
import {
  authChecked,
  authorizationSlice,
  logoutUser,
  registrationUser,
  loginUserThunk,
  getUserThunk,
  updateUserThunk,
  initialState
} from '../slices/authorizationSlice';

// Мокирование
global.document = {
  cookie: '../../utils/cookie'
} as Document;

jest.mock('../../utils/cookie', () => ({
  getCookie: jest.fn(
    (name: string) =>
      global.document.cookie.match(
        new RegExp('(?:^|; )' + name + '=([^;]*)')
      )?.[1]
  ),
  setCookie: jest.fn(
    (
      name: string,
      value: string,
      props: { [key: string]: string | number | Date | boolean }
    ) => {
      let updatedCookie = `${name}=${value}`;
      Object.keys(props).forEach((key) => {
        updatedCookie += `; ${key}=${props[key]}`;
      });
      global.document.cookie = updatedCookie;
    }
  ),
  deleteCookie: jest.fn((name: string) => {
    global.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  })
}));

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  clear: jest.fn(),
  key: jest.fn()
};
// -----------------------------

describe('Тестирование редьюсера слайса authorization', () => {
  const mockAuthResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    success: true,
    user: {
      email: 'test@example.com',
      name: 'Test User'
    }
  };

  const mockError = {
    name: 'TestError',
    message: 'Test error message'
  };

  describe('Проверка синхронных экшенов', () => {
    it('Проверка экшена статуса пользователя - authChecked', () => {
      const { isAuthChecked } = authorizationSlice.reducer(
        initialState,
        authChecked()
      );
      expect(isAuthChecked).toEqual(true);
    });

    it('Проверка экшена очистки-выхода пользователя - logoutUser', () => {
      const { isAuthChecked, userData, isAuthenticated } =
        authorizationSlice.reducer(initialState, logoutUser());
      expect(isAuthChecked).toBe(false);
      expect(userData).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('Проверка асинхронных экшенов', () => {
    describe('Проверка регистрации пользователя - registrationUser', () => {
      it('При вызове экшена Request', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: registrationUser.pending.type
        });
        expect(state.userRequest).toBe(true);
      });

      it('При вызове экшена Success', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: registrationUser.fulfilled.type,
          payload: mockAuthResponse
        });
        expect(state.userRequest).toBe(false);
        expect(state.userData).toEqual(mockAuthResponse);
      });

      it('При вызове экшена Failed', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: registrationUser.rejected.type,
          error: mockError
        });
        expect(state.userRequest).toBe(false);
        expect(state.userError).toEqual(mockError);
      });
    });

    describe('Проверка входа пользователя - loginUserThunk', () => {
      it('При вызове экшена Request', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: loginUserThunk.pending.type
        });
        expect(state.userRequest).toBe(true);
      });

      it('При вызове экшена Success', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: loginUserThunk.fulfilled.type,
          payload: mockAuthResponse
        });
        expect(state.userRequest).toBe(false);
        expect(state.userData).toEqual(mockAuthResponse);
      });

      it('При вызове экшена Failed', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: loginUserThunk.rejected.type,
          error: mockError
        });
        expect(state.userRequest).toBe(false);
        expect(state.userError).toEqual(mockError);
      });
    });

    describe('Проверка получения данных пользователя - getUserThunk', () => {
      it('При вызове экшена Request', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: getUserThunk.pending.type
        });
        expect(state.userRequest).toBe(true);
      });

      it('При вызове экшена Success', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: getUserThunk.fulfilled.type,
          payload: mockAuthResponse.user
        });
        expect(state.userRequest).toBe(false);
        expect(state.userData).toEqual(mockAuthResponse.user);
        expect(state.isAuthenticated).toBe(true);
      });

      it('При вызове экшена Failed', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: getUserThunk.rejected.type,
          error: mockError
        });
        expect(state.userRequest).toBe(false);
        expect(state.userError).toEqual(mockError);
      });
    });

    describe('Проверка обновления пользователя - updateUserThunk', () => {
      it('При вызове экшена Request', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: updateUserThunk.pending.type
        });
        expect(state.userRequest).toBe(true);
      });

      it('При вызове экшена Success', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: updateUserThunk.fulfilled.type,
          payload: mockAuthResponse.user
        });
        expect(state.userRequest).toBe(false);
        expect(state.userData).toEqual(mockAuthResponse.user);
      });

      it('При вызове экшена Failed', () => {
        const state = authorizationSlice.reducer(initialState, {
          type: updateUserThunk.rejected.type,
          error: mockError
        });
        expect(state.userRequest).toBe(false);
        expect(state.userError).toEqual(mockError);
      });
    });
  });

  describe('Проверка селекторов', () => {
    const store = configureStore({
      reducer: {
        authorization: authorizationSlice.reducer
      },
      preloadedState: {
        authorization: {
          isAuthChecked: true,
          isAuthenticated: true,
          userData: mockAuthResponse,
          userRequest: false,
          userError: null
        }
      }
    });

    it('Проверка селектора получения ошибки - getUserErrorSelector', () => {
      const userError = store.getState().authorization.userError;
      expect(userError).toBeNull();
    });

    it('Проверка селектора получения статуса аутентификации - getAuthenticatedSelector', () => {
      const isAuthenticated = store.getState().authorization.isAuthenticated;
      expect(isAuthenticated).toBe(true);
    });

    it('Проверка селектора получения статуса проверки пользователя - getAuthCheckedSelector', () => {
      const isAuthChecked = store.getState().authorization.isAuthChecked;
      expect(isAuthChecked).toBe(true);
    });

    it('Проверка селектора получения данных о пользователе - getUserSelector', () => {
      const userData = store.getState().authorization.userData?.user;
      expect(userData).toEqual(mockAuthResponse.user);
    });

    it('Проверка селектора получения статуса запроса пользователя - getUserRequestSelector', () => {
      const userRequest = store.getState().authorization.userRequest;
      expect(userRequest).toBe(false);
    });
  });
});
