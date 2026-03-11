import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestJson, withAuth } from '../../lib/api';
import { logout } from '../auth/authSlice';

const toApiErrorMessage = (error) => error?.message || 'Cart request failed';

const normalizeCartItem = (item) => ({
  id: item.id,
  productId: item.product_id,
  name: item.name,
  price: Number(item.price || 0),
  qty: Number(item.quantity || 0),
  subtotal: Number(item.subtotal || 0)
});

const normalizeCart = (payload) => {
  const items = Array.isArray(payload?.items) ? payload.items.map(normalizeCartItem) : [];
  const subtotal = Number(payload?.total || 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);
  return { items, subtotal, totalQuantity };
};

const requireAuthToken = (getState, rejectWithValue) => {
  const token = getState().auth?.accessToken;
  if (!token) {
    return rejectWithValue('Please sign in to access your cart.');
  }
  return null;
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson('/cart', { headers: withAuth(token) });
    return normalizeCart(result);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson('/cart', {
      method: 'POST',
      headers: withAuth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ product_id: Number(productId), quantity: Number(quantity) })
    });
    return normalizeCart(result);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const increaseQty = createAsyncThunk('cart/increaseQty', async ({ cartItemId, currentQty }, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson(`/cart/${cartItemId}`, {
      method: 'PUT',
      headers: withAuth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ quantity: Number(currentQty) + 1 })
    });
    return normalizeCart(result);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const decreaseQty = createAsyncThunk('cart/decreaseQty', async ({ cartItemId, currentQty }, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    if (Number(currentQty) <= 1) {
      const result = await requestJson(`/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: withAuth(token)
      });
      return normalizeCart(result);
    }

    const result = await requestJson(`/cart/${cartItemId}`, {
      method: 'PUT',
      headers: withAuth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ quantity: Number(currentQty) - 1 })
    });
    return normalizeCart(result);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ cartItemId }, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson(`/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: withAuth(token)
    });
    return normalizeCart(result);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState, rejectWithValue }) => {
  const blocked = requireAuthToken(getState, rejectWithValue);
  if (blocked) return blocked;

  try {
    const token = getState().auth.accessToken;
    const currentItems = getState().cart.items;
    for (const item of currentItems) {
      await requestJson(`/cart/${item.id}`, {
        method: 'DELETE',
        headers: withAuth(token)
      });
    }
    return { items: [], subtotal: 0, totalQuantity: 0 };
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

const initialState = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  status: 'idle',
  error: null
};

const applyCartState = (state, payload) => {
  state.items = payload.items;
  state.subtotal = payload.subtotal;
  state.totalQuantity = payload.totalQuantity;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load cart';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || 'Unable to add item';
      })
      .addCase(increaseQty.fulfilled, (state, action) => {
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(increaseQty.rejected, (state, action) => {
        state.error = action.payload || 'Unable to update cart';
      })
      .addCase(decreaseQty.fulfilled, (state, action) => {
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(decreaseQty.rejected, (state, action) => {
        state.error = action.payload || 'Unable to update cart';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || 'Unable to remove item';
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.error = null;
        applyCartState(state, action.payload);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || 'Unable to clear cart';
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.totalQuantity = 0;
        state.status = 'idle';
        state.error = null;
      });
  }
});

export default cartSlice.reducer;
