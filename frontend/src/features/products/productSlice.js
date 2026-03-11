import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FORCE_MOCK_DATA, requestJson, withAuth } from '../../lib/api';

const normalizeProduct = (product, index) => ({
  id: product.id ?? product._id ?? product.product_id ?? `product-${index}`,
  name: product.name ?? product.title ?? 'Unnamed product',
  category: String(product.category ?? 'uncategorized').toLowerCase(),
  description: product.description ?? '',
  stock: Number(product.stock ?? 0),
  price: Number(product.price ?? 0),
  rating: Number(product.rating ?? product.average_rating ?? 4),
  image: product.image ?? product.imageUrl ?? product.image_url ?? product.thumbnail ?? '',
  sourcePlatform: product.sourcePlatform ?? product.source_platform ?? product.vendor ?? '',
  sourceUrl: product.sourceUrl ?? product.source_url ?? product.url ?? ''
});

const normalizeCatalog = (items) => items.map(normalizeProduct);

const backendUnavailableMessage = (errorMessage) => `Backend unavailable. ${errorMessage}`;
const frontendOnlyMessage = 'Frontend mode is active. Products will appear when backend products are available.';

const isBackendReady = (state) => state.products.backendStatus === 'online';

const toApiErrorMessage = (error) => error?.message || 'Unable to reach backend';

const fallbackResult = (message) => ({
  items: [],
  backendStatus: FORCE_MOCK_DATA ? 'mock' : 'offline',
  notice: FORCE_MOCK_DATA
    ? frontendOnlyMessage
    : backendUnavailableMessage(message)
});

const rejectWhenBackendUnavailable = (getState, rejectWithValue) => {
  if (!isBackendReady(getState())) {
    return rejectWithValue('Admin actions are disabled until the backend API is available.');
  }
  return null;
};

const rejectWhenNotAdmin = (getState, rejectWithValue) => {
  const auth = getState().auth;
  if (!auth?.accessToken) {
    return rejectWithValue('Please sign in as admin to manage products.');
  }
  if (auth?.user?.role !== 'admin') {
    return rejectWithValue('Admin role is required for product management.');
  }
  return null;
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  if (FORCE_MOCK_DATA) {
    return fallbackResult('Live API calls are disabled.');
  }

  try {
    const result = await requestJson('/products?per_page=200');
    const items = Array.isArray(result.products) ? result.products : [];
    return {
      items: normalizeCatalog(items),
      backendStatus: 'online',
      notice: ''
    };
  } catch (error) {
    return fallbackResult(toApiErrorMessage(error));
  }
});

export const createProduct = createAsyncThunk('products/createProduct', async ({ data }, { getState, rejectWithValue }) => {
  const blocked = rejectWhenBackendUnavailable(getState, rejectWithValue);
  if (blocked) return blocked;
  const blockedAuth = rejectWhenNotAdmin(getState, rejectWithValue);
  if (blockedAuth) return blockedAuth;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson('/products', {
      method: 'POST',
      headers: withAuth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    return normalizeProduct({ ...data, ...result.product }, 0);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, data }, { getState, rejectWithValue }) => {
  const blocked = rejectWhenBackendUnavailable(getState, rejectWithValue);
  if (blocked) return blocked;
  const blockedAuth = rejectWhenNotAdmin(getState, rejectWithValue);
  if (blockedAuth) return blockedAuth;

  try {
    const token = getState().auth.accessToken;
    const result = await requestJson(`/products/${id}`, {
      method: 'PUT',
      headers: withAuth(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    return normalizeProduct({ ...data, ...result.product, id }, 0);
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async ({ id }, { getState, rejectWithValue }) => {
  const blocked = rejectWhenBackendUnavailable(getState, rejectWithValue);
  if (blocked) return blocked;
  const blockedAuth = rejectWhenNotAdmin(getState, rejectWithValue);
  if (blockedAuth) return blockedAuth;

  try {
    const token = getState().auth.accessToken;
    await requestJson(`/products/${id}`, {
      method: 'DELETE',
      headers: withAuth(token)
    });
    return id;
  } catch (error) {
    return rejectWithValue(toApiErrorMessage(error));
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    backendStatus: 'unknown',
    backendNotice: '',
    adminStatus: 'idle',
    adminError: null,
    query: '',
    category: 'all',
    sortBy: 'featured'
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetAdminError: (state) => {
      state.adminError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.backendStatus = action.payload.backendStatus;
        state.backendNotice = action.payload.notice;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.adminStatus = 'loading';
        state.adminError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload || 'Create failed';
      })
      .addCase(updateProduct.pending, (state) => {
        state.adminStatus = 'loading';
        state.adminError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload || 'Update failed';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.adminStatus = 'loading';
        state.adminError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload || 'Delete failed';
      });
  }
});

export const { setQuery, setCategory, setSortBy, resetAdminError } = productSlice.actions;
export default productSlice.reducer;
