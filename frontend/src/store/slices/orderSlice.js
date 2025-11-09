import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchMyOrders = createAsyncThunk("order/orders/me", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/order/orders/me");
    return res.data.myOrders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const placeOrder = createAsyncThunk("order/new", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/order/new", data);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to place order, Try again.");
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const fetchSingleOrder = createAsyncThunk(
  "order/fetchSingleOrder", 
  async (orderId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/order/${orderId}`);
    return res.data.orders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Order not found.");
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    singleOrder: null,
    fetchingOrders: false,
    fetchingSingleOrder: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
    error: null,
  },
  reducers: {
    toggleOrderStep(state) {
      state.orderStep = 1;
    },
    clearSingleOrder(state) {
      state.singleOrder = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.fetchingOrders = true;
      state.error =null;
    })
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.fetchingOrders = false;
      state.myOrders = action.payload;
    })
    builder.addCase(fetchMyOrders.rejected, (state) => {
      state.fetchingOrders = false;
      state.error = action.payload;
    })
    builder.addCase(fetchSingleOrder.pending, (state) => {
      state.fetchingSingleOrder = true;
      state.error = null;
    })
    builder.addCase(fetchSingleOrder.fulfilled, (state, action) => {
      state.fetchingSingleOrder = false;
      state.singleOrder = action.payload;
    })
    builder.addCase(fetchSingleOrder.rejected, (state, action) => {
      state.fetchingSingleOrder = false;
      state.error = action.payload;
    })
    builder.addCase(placeOrder.pending, (state) => {
      state.placingOrder = true;
      state.error = null;
    })
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.placingOrder = false;
      state.finalPrice = action.payload.total_price;
      state.paymentIntent = action.payload.paymentIntent;
      state.orderStep = 2;
    })
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.placingOrder = false;
      state.error = action.payload;
    })
  },
});

export default orderSlice.reducer;
export const { toggleOrderStep, clearSingleOrder, clearError} = orderSlice.actions;
