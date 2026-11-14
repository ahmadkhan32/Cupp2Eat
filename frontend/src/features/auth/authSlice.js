import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/lib/supabase/client';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    let role = data.user?.user_metadata?.role || 'customer';
    try {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      if (roleRow?.role) role = roleRow.role;
    } catch (_) {}

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        role,
      },
      session: data.session,
    };
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async ({ email, password, full_name }, { rejectWithValue }) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role: 'customer' },
      },
    });
    if (error) throw error;

    return {
      user: {
        id: data.user?.id,
        email,
        full_name,
        role: 'customer',
      },
      session: data.session,
    };
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    return true;
  } catch (err) {
    return rejectWithValue(err.message || 'Logout failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    let role = user.user_metadata?.role || 'customer';
    try {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (roleRow?.role) role = roleRow.role;
    } catch (_) {}

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        role,
      },
    };
  } catch (err) {
    return rejectWithValue(err.message || 'Not authenticated');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, role: null, loading: false, error: null, isAuthenticated: false },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.role = a.payload.user?.role;
        s.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.role = a.payload.user?.role;
        s.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; s.role = null; s.isAuthenticated = false; })
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload.user;
        s.role = a.payload.user?.role;
        s.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (s) => { s.user = null; s.role = null; s.isAuthenticated = false; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
