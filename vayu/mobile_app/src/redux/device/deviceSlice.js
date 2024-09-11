import { createSlice } from '@reduxjs/toolkit';

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    deviceName: '',
    deviceId: '',
    isDevAvailable: true,
  },
  reducers: {
    setDeviceName: (state, action) => {
      state.deviceName = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    setIsDevAvailable: (state, action) => {
      state.isDevAvailable = action.payload;
    },
  },
});

export const {
  setDeviceName,
  setDeviceId,
  setIsDevAvailable

} = deviceSlice.actions;

export const selectDeviceName = (state) => state.device.deviceName;
export const selectDeviceId = (state) => state.device.deviceId;
export const selectIsDevAvailable = (state) => state.device.isDevAvailable;

export const deviceReducer = deviceSlice.reducer;
