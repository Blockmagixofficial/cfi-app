import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import receiverReducer from './receiverSlice';
const persistConfig = {
  key: 'user', // Make sure the key is correct
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer, // Persisted user reducer
    receiver: receiverReducer,
  },
});

export const persistor = persistStore(store);
export default store;
