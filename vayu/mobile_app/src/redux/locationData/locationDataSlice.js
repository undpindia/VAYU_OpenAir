import { createSlice } from '@reduxjs/toolkit';

export const locationDataSlice = createSlice({
  name: 'locationData',
  initialState: {
    locationData: "",
  },
  reducers: {
    setlocationData: (state, action) => {
      state.locationData = action.payload;
    },
  },
});

export const { setlocationData } = locationDataSlice.actions;

export const selectlocationData = (state) => state.locationData.locationData;

export const locationDataReducer = locationDataSlice.reducer;
