import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer
  }
});
