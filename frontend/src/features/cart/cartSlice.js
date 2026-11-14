import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, itemCount: 0 },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id && i.variantId === action.payload.variantId);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => !(i.id === action.payload.id && i.variantId === action.payload.variantId));
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id && i.variantId === action.payload.variantId);
      if (item) item.quantity = action.payload.quantity;
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },
    clearCart: (state) => { state.items = []; state.total = 0; state.itemCount = 0; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
