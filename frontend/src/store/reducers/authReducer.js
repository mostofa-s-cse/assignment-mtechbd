import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isAuth: false,
  user: null,
  modules: null,
  accessToken: null,
  refreshToken: null,
  tempData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    signin: (state, action) => {
      state.isAuth = true;
      state.user = action.payload.user;
      state.modules = action.payload.modules;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    signout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.modules = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setTempData: (state, action) => {
      state.tempData = action.payload;
    },
    clearTempData: (state) => {
      state.tempData = null;
    },
    updateRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
