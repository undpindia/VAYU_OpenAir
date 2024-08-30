import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    role: null,
    userId: null,
  },
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setRole: (state, action) => {
      state.role = action.payload;
    },

    setUid: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setIsAuthenticated, setRole, setUid } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectRole = (state) => state.auth.role;

export const selectUid = (state) => state.auth.userId;

export const authReducer = authSlice.reducer;
