import { createSlice } from '@reduxjs/toolkit';

const loadAuth = () => {
  try {
    const raw = localStorage.getItem('dicalo_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persisted = typeof window !== 'undefined' ? loadAuth() : null;

const initialState = {
  isAuthenticated: Boolean(persisted?.isAuthenticated),
  user: persisted?.user || null,
  accessToken: persisted?.accessToken || '',
  error: null
};

const persist = (state) => {
  try {
    localStorage.setItem(
      'dicalo_auth',
      JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken
      })
    );
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || '';
      state.error = null;
      persist(state);
    },
    loginFailed: (state, action) => {
      state.error = action.payload || 'Invalid credentials';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = '';
      state.error = null;
      persist(state);
    }
  }
});

export const { loginSuccess, loginFailed, logout } = authSlice.actions;
export default authSlice.reducer;
