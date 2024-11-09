import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    authToken: null,
    twoFactorEnabled: false,
    expiresIn: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo || state.userInfo;
      state.authToken = action.payload.authToken || state.authToken;
      state.twoFactorEnabled = action.payload.twoFactorEnabled || state.twoFactorEnabled;
      state.expiresIn = action.payload.expiresIn || state.expiresIn;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.authToken = null;
      state.twoFactorEnabled = false;
      state.expiresIn = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
