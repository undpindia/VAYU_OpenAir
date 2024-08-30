import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileName: '',
    lastVisitedLink: '',
  },
  reducers: {
    setProfileName: (state, action) => {
      state.profileName = action.payload;
    },

    setLastVisitedLink: (state, action) => {
      state.lastVisitedLink = action.payload;
    },
  },
});

export const { setProfileName, setLastVisitedLink } = profileSlice.actions;

export const selectProfileName = (state) => state.profile.profileName;

export const selectLastVisitedLink = (state) => state.profile.lastVisitedLink;

export const profileReducer = profileSlice.reducer;
