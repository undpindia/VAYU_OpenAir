import { createSlice } from '@reduxjs/toolkit';

export const userApprovalSlice = createSlice({
  name: 'userApproval',
  initialState: {
    userApproved: true,
  },
  reducers: {
    setUserApproved: (state, action) => {
      state.userApproved = action.payload;
    }
  },
});

export const { setUserApproved } = userApprovalSlice.actions;

export const selectUserApproved = (state) => state.userApproval.userApproved;

export const userApprovalReducer = userApprovalSlice.reducer;