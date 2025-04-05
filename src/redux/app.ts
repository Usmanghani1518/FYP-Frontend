
// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './slices/user.slice';
// import cartReducer from './slices/cart.slice'; // Add this import

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     cart: cartReducer, // Add cart reducer
//   },
//   // Optional middleware configuration
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Disable if using non-serializable values
//     }),
// });

// // Export the types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// app/store.ts


// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage
// import cartReducer from './slices/cart.slice';
// import userReducer from './slices/user.slice';

// const cartPersistConfig = {
//   key: 'cart',
//   storage,
//   whitelist: ['items'] // only persist cart items
// };

// const userPersistConfig = {
//   key: 'user',
//   storage,
//   whitelist: ['token', 'user'] // persist user auth data
// };

// export const store = configureStore({
//   reducer: {
//     cart: persistReducer(cartPersistConfig, cartReducer),
//     user: persistReducer(userPersistConfig, userReducer),
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'], // ignore redux-persist actions
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cart.slice';
import userReducer from './slices/user.slice';

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items']
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['token', 'user']
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    user: persistedUserReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;