import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../axios";
import { errorFun } from "../../utils/errFun";

const initial = {
  auth: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/register", data);
      return response.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/login", data);
      return response.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/logout");
      return response.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/refresh");
      return response.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

const authSlice = createSlice({
  initialState: initial,
  name: "auth",
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
      }),
});

export default authSlice.reducer;
