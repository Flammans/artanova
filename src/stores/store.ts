import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Create the Redux store and add the user reducer
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
