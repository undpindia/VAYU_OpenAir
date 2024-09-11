import { createSlice } from '@reduxjs/toolkit';

export const offlineDataSlice = createSlice({
  name: 'offlineData',
  initialState: {
    offlineData: {},
  },
  reducers: {
    setofflineData: (state, action) => {
      state.offlineData = action.payload;
    },
  },
});

export const { setofflineData } = offlineDataSlice.actions;

export const selectOfflineData = (state) => state.offlineData.offlineData;

export const offlineDataReducer = offlineDataSlice.reducer;
