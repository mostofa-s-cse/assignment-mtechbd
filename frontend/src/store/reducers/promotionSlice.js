import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // This will hold the promotion data
};

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setPromotions: (state, action) => {
      state.items = action.payload; // Set the promotions from the API response
    },
    addPromotion: (state, action) => {
      state.items.push(action.payload); // Add a new promotion to the list
    },
    updatePromotion: (state, action) => {
      const index = state.items.findIndex((promotion) => promotion.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload; // Update the existing promotion
      }
    },
    removePromotion: (state, action) => {
      state.items = state.items.filter((promotion) => promotion.id !== action.payload); // Remove a promotion by ID
    },
  },
});

// Export actions
export const promotionActions = promotionSlice.actions;

// Export reducer
export default promotionSlice.reducer;