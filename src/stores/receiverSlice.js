import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

export const fetchUserData = createAsyncThunk(
  "receiver/fetchUserData",
  async (ucpiId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/userByUcpiId/${ucpiId}`);
      if (response.data === null) {
        throw new Error("User bank details not found. Please check and try again.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const receiverSlice = createSlice({
  name: "receiver",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReceiverData: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReceiverData } = receiverSlice.actions;
export default receiverSlice.reducer;
