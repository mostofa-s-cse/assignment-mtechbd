import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // This will hold the product data
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload; // Set the products from the API response
    },
    addProduct: (state, action) => {
      state.items.push(action.payload); // Add a new product to the list
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload; // Update the existing product
      }
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter((product) => product.id !== action.payload); // Remove a product by ID
    },
  },
});

// Export actions
export const productActions = productSlice.actions;

// Export reducer
export default productSlice.reducer;