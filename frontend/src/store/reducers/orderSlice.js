import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.orders = action.payload; // Set the orders from the API response
      } else {
        console.error('Expected an array of orders, but got:', action.payload);
      }
    },
    addOrder: (state, action) => {
      if (Array.isArray(state.orders)) {
        state.orders.push(action.payload); // Add a new order to the list
      } else {
        console.error('state.orders is not an array:', state.orders);
      }
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