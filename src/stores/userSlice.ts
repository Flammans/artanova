import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the structure of the user state, including the token
interface UserState {
  name: string | null;
  email: string | null;
  token: string | null;
}

// Get user data from localStorage if available
const getUserFromLocalStorage = (): UserState => {
  const userData = localStorage.getItem('user')
  if (userData) {
    return JSON.parse(userData)
  }
  return { name: null, email: null, token: null }
}

// Initial state for the user, using data from localStorage if available
const initialState: UserState = getUserFromLocalStorage()

// Create the slice for user data
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer to set user data and save it to localStorage
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(state)) // Save user data to localStorage
    },
    // Reducer to clear user data and remove it from localStorage
    clearUser: (state) => {
      state.name = null
      state.email = null
      state.token = null
      localStorage.removeItem('user') // Remove user data from localStorage
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
