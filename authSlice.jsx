import { createSlice } from '@reduxjs/toolkit';

// Initial state setup
const initialState = {
  isAuthenticated: false,
  isRegistered: false,
  user: null,
  errorMessage: null,
};

// Function to check local storage for user data
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Define the authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    user: getUserFromLocalStorage(), // Load user from local storage
    isAuthenticated: !!getUserFromLocalStorage(), // Check if the user is authenticated
    isRegistered: !!localStorage.getItem('user'), // Check if the user is registered
  },
  reducers: {
    signUp: (state, action) => {
      const { email, password } = action.payload;

      state.isRegistered = true;
      state.user = { email };
      state.errorMessage = null;

      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify({ email, password }));
    },
    signIn: (state, action) => {
      const { email, password } = action.payload;
      const storedUser = getUserFromLocalStorage(); // Retrieve user from local storage

      if (storedUser) {
        if (storedUser.email === email && storedUser.password === password) {
          state.isAuthenticated = true; // Update authentication status on successful sign-in
          state.user = { email }; // Store user data in the state
          state.errorMessage = null; // Clear any error on successful sign-in
          localStorage.setItem('token', 'dummy_token'); // Save token in local storage
        } else {
          state.errorMessage = 'Invalid email or password. Please try again.'; // Set error for incorrect email/password
        }
      } else {
        state.errorMessage = 'User not found. Please create an account first.'; // Set error for user not found
      }
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.errorMessage = null; 
      localStorage.removeItem('token');
     
    },
  },
});


export const { signUp, signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
