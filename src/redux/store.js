import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import interviewReducer from './slices/interviewSlice';
import candidatesReducer from './slices/candidatesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['interview', 'candidates'] // only these reducers will be persisted
};

const rootReducer = combineReducers({
  interview: interviewReducer,
  candidates: candidatesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);