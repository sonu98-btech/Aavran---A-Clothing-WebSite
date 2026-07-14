import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/state/auth.slice'
import productSlice from '../features/product/state/product.slice'
import cartSlice from '../features/cart/state/cart.slice'

export const store = configureStore({
    reducer:{
        auth: authSlice,
        product: productSlice,
        cart: cartSlice
    }
})