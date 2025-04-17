import { createSlice } from "@reduxjs/toolkit";
import { MdPending } from "react-icons/md";

const productSlice = createSlice({
  name: "product",
  initialState: {
    pendingOrders: [],
    shippedOrders: [],
    deliveredOrders: [],
    cancelledOrders: [],
    allProduct: [],
  },
  reducers: {
    setPendingOrders: (state, action) => {
      state.pendingOrders = action.payload;
    },
    setShippedOrders: (state, action) => {
      state.shippedOrders = action.payload;
    },
    setDeliveredOrders: (state, action) => {
      state.deliveredOrders = action.payload;
    },
    setCancelledOrders: (state, action) => {
      state.cancelledOrders = action.payload;
    },
    setAllProduct: (state, action) => {
      state.allProduct = action.payload;
    },
  },
});
export const {setPendingOrders,setShippedOrders,setDeliveredOrders,setCancelledOrders, setAllProduct}= productSlice.actions;

export default productSlice.reducer
