import { configureStore } from '@reduxjs/toolkit';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { profileReducer } from './Profile/profileSlice';
import { authReducer } from './auth/authSlice';
import { offlineDataReducer } from './offlineData/offlineDataSlice';
import { locationDataReducer } from './locationData/locationDataSlice';
// import { deviceDataReducer } from './deviceData/deviceDataSlice';
import { userApprovalReducer } from './userApproval/userApproval';
import { deviceReducer } from './device/deviceSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'profile', 'offlineData', 'locationData'],
  clearOnPurge: true,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedProfileReducer = persistReducer(persistConfig, profileReducer);
// const persistedDeviceDataReducer = persistReducer(
//   persistConfig,
//   deviceDataReducer
// );
const persistedOfflineDataReducer = persistReducer(
  persistConfig,
  offlineDataReducer
);
const persistedLocationReducer = persistReducer(
  persistConfig,
  locationDataReducer
);
const persistedUserApprovalReducer = persistReducer(
  persistConfig,
  userApprovalReducer
);
const persistedDeviceReducer = persistReducer(
  persistConfig,
  deviceReducer
);
export const store = configureStore({
  reducer: {
    offlineData: persistedOfflineDataReducer,
    auth: persistedAuthReducer,
    profile: persistedProfileReducer,
    // deviceData: persistedDeviceDataReducer,
    locationData: persistedLocationReducer,
    userApproval: persistedUserApprovalReducer,
    device: persistedDeviceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
