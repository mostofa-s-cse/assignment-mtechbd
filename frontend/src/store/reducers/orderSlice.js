import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload; // Set the orders from the API response
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload); // Add a new order to the list
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex((order) => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload }; // Update the existing order with new data
      }
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload); // Remove an order by ID
    },
  },
});

// Export actions
export const orderActions = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;