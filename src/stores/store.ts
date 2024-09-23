import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import collectionsReducer from './collectionsSlice'

// Create the Redux store and add the user reducer
export const store = configureStore({
  reducer: {
    user: userReducer,
    collections: collectionsReducer
  },
})

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
