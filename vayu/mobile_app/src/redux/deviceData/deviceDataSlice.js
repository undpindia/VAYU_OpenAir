import { createSlice } from '@reduxjs/toolkit';

export const deviceDataSlice = createSlice({
  name: 'deviceData',
  initialState: {
    dataId: '',
    lat: '',
    long: '',
    pm25: '',
    pm10: '',
    no2: '',
    co: '',
    co2: '',
    ch4: '',
    temp: '',
    rh: '',
    deviceId: '',
  },
  reducers: {
    setDataId: (state, action) => {
      state.dataId = action.payload;
    },
    setLat: (state, action) => {
      state.lat = action.payload;
    },
    setLong: (state, action) => {
      state.long = action.payload;
    },
    setPm10: (state, action) => {
      state.pm10 = action.payload;
    },
    setPm25: (state, action) => {
      state.pm25 = action.payload;
    },
    setNo2: (state, action) => {
      state.no2 = action.payload;
    },
    setCo: (state, action) => {
      state.co = action.payload;
    },
    setCo2: (state, action) => {
      state.co2 = action.payload;
    },
    setCh4: (state, action) => {
      state.ch4 = action.payload;
    },
    setTemp: (state, action) => {
      state.temp = action.payload;
    },
    setRh: (state, action) => {
      state.rh = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
  },
});

export const {
  setDataId,
  setLat,
  setLong,
  setPm10,
  setPm25,
  setCh4,
  setCo,
  setCo2,
  setNo2,
  setRh,
  setTemp,
  setDeviceId,
} = deviceDataSlice.actions;

export const selectDataId = (state) => state.deviceData.dataId;

export const selectLat = (state) => state.auth.lat;

export const selectLongong = (state) => state.auth.long;

export const selectPm25 = (state) => state.auth.pm25;

export const selectPm10 = (state) => state.auth.pm10;

export const selectNo2 = (state) => state.auth.no2;

export const selectCo = (state) => state.auth.co;

export const selectCo2 = (state) => state.auth.co2;

export const selectCh4 = (state) => state.auth.ch4;

export const selectTemp = (state) => state.auth.temp;

export const selectRh = (state) => state.auth.rh;

export const selectDeviceID = (state) => state.auth.deviceID;

export const deviceDataReducer = deviceDataSlice.reducer;
