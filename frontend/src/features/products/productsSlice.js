import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/lib/supabase/client';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_published', true);

    const { data, count, error } = await query;
    if (error) throw error;
    return { products: data || [], total: count || 0 };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch products');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null, total: 0, page: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.products;
        s.total = a.payload.total;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default productsSlice.reducer;
