import { RootState } from '../../services/store';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '../../utils/burger-api';

type TFeedState = {
  feedData: TFeedsResponse;
  loading: boolean;
  error: SerializedError | null;
};

export const initialState: TFeedState = {
  feedData: {
    success: false,
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const fetchAllFeeds = createAsyncThunk(
  'feed/fetchAllFeeds',
  getFeedsApi
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feedData = action.payload;
      })
      .addCase(fetchAllFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectFeedOrders = (state: RootState) =>
  state.feed.feedData.orders;

export const selectFeedData = (state: RootState) => state.feed.feedData;

export const selectFeedError = (state: RootState) => state.feed.error;

export const selectFeedLoading = (state: RootState) => state.feed.loading;

export default feedSlice.reducer;
