import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Token {
  access: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: Token | null;
  expiry: number;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  expiry: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: Token }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiry = Date.now() + action.payload.token.expiresIn;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expiry = 0;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
