import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null, total: 0, page: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.products; s.total = a.payload.total; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default productsSlice.reducer;
