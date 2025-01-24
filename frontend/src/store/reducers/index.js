import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer"; 
import productReducer from "./productSlice"; 
import promotionReducer from "./promotionSlice"; 
import orderReducer from "./orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  promotions: promotionReducer, 
  orders: orderReducer
});

export default rootReducer;