import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';

import {
  TAuthResponse,
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TUserResponse
} from '@api';
import { setCookie } from '../../utils/cookie';

export type TAuthorizationState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userData: TAuthResponse | TUserResponse | null;
  userRequest: boolean;
  userError: SerializedError | null;
};

export const initialState: TAuthorizationState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: null,
  userRequest: false,
  userError: null
};

const handlePending = (state: TAuthorizationState) => {
  state.userRequest = true;
  state.userError = null;
};

const handleFulfilled = (state: TAuthorizationState, action: any) => {
  state.userData = action.payload;
  state.userRequest = false;
  state.isAuthChecked = true;
  state.isAuthenticated = true;
};

const handleRejected = (state: TAuthorizationState, action: any) => {
  state.userError = action.error;
  state.userRequest = false;
  state.isAuthChecked = true;
};

export const registrationUser = createAsyncThunk(
  'authorization/registrationUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    const { email, password, name } = data;
    console.log('Запрос на регистрацию с данными:', data);

    if (!email || !password || !name) {
      return rejectWithValue({
        success: false,
        message: 'Все поля должны быть заполнены'
      });
    }

    const dataResponse = await registerUserApi(data);
    if (!dataResponse?.success) return rejectWithValue(dataResponse);

    setCookie('accessToken', dataResponse.accessToken);
    localStorage.setItem('refreshToken', dataResponse.refreshToken);
    console.log(dataResponse);
    return dataResponse;
  }
);

export const loginUserThunk = createAsyncThunk(
  'authorization/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    const { email, password } = data;

    if (!email || !password) {
      return rejectWithValue({
        success: false,
        message: 'Пожалуйста, введите email и пароль'
      });
    }

    const dataResponse = await loginUserApi(data);
    if (!dataResponse?.success) return rejectWithValue(dataResponse);

    setCookie('accessToken', dataResponse.accessToken);
    localStorage.setItem('refreshToken', dataResponse.refreshToken);
    console.log(
      'Токены установлены:',
      dataResponse.accessToken,
      dataResponse.refreshToken
    );
  }
);

export const getUserThunk = createAsyncThunk(
  'authorization/getUser',
  async () => await getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  'authorization/updateUser',
  async (data: TRegisterData) => await updateUserApi(data)
);

export const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    logoutUser: (state) => {
      state.userData = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registrationUser.pending, handlePending)
      .addCase(registrationUser.fulfilled, handleFulfilled)
      .addCase(registrationUser.rejected, handleRejected);

    builder
      .addCase(loginUserThunk.pending, handlePending)
      .addCase(loginUserThunk.fulfilled, handleFulfilled)
      .addCase(loginUserThunk.rejected, handleRejected);

    builder
      .addCase(getUserThunk.pending, handlePending)
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userRequest = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.rejected, handleRejected);

    builder
      .addCase(updateUserThunk.pending, handlePending)
      .addCase(updateUserThunk.fulfilled, handleFulfilled)
      .addCase(updateUserThunk.rejected, handleRejected);
  }
});

export const { authChecked, logoutUser } = authorizationSlice.actions;

export const selectIsAuthenticated = (state: {
  authorization: TAuthorizationState;
}) => state.authorization.isAuthenticated;

export const selectIsAuthChecked = (state: {
  authorization: TAuthorizationState;
}) => state.authorization.isAuthChecked;

export const selectCurrentUser = (state: {
  authorization: TAuthorizationState;
}) => state.authorization.userData?.user;

export const selectUserRequestStatus = (state: {
  authorization: TAuthorizationState;
}) => state.authorization.userRequest;

export const selectUserError = (state: {
  authorization: TAuthorizationState;
}) => state.authorization.userError;

export default authorizationSlice.reducer;
