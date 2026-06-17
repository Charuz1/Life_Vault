import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
// import documentReducer from './documents/documentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // documents: documentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
