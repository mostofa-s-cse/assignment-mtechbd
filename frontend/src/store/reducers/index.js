import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer"; 
import productReducer from "./productSlice"; 
import promotionReducer from "./promotionSlice"; 

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  promotions: promotionReducer, 
});

export default rootReducer;