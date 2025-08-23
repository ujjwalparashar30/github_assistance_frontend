import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import sessionSlice from './slices/sessionSlice';
import assessmentSlice from './slices/assessmentSlice';

export const store = configureStore({
  reducer: {
    // API slice
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Local state slices
    session: sessionSlice,
    assessment: assessmentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['api/updateQueryData'],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;