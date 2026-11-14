const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, FRONTEND_URL } = require('../../config/env');

const getAdminClient = () =>
  createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

const getAnonClient = () =>
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authService = {
  async register(email, password, full_name) {
    const anon = getAnonClient();
    const { data, error } = await anon.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'customer' } },
    });
    if (error) throw error;

    if (data.user) {
      const admin = getAdminClient();
      await admin.from('profiles').upsert({
        id: data.user.id,
        full_name,
        email,
        created_at: new Date().toISOString(),
      });
      await admin.from('user_roles').upsert({
        user_id: data.user.id,
        role: 'customer',
      });
    }

    return data;
  },

  async login(email, password) {
    const anon = getAnonClient();
    const { data, error } = await anon.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const admin = getAdminClient();
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    const { data: profile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      ...data,
      user: {
        ...data.user,
        role: roleRow?.role || data.user.user_metadata?.role || 'customer',
        profile: profile || {},
      },
    };
  },

  async createAdminUser(email, password, full_name, role, organization_name, createdBy) {
    const admin = getAdminClient();

    // Create user in Supabase Auth with pre-confirmed email
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role, organization_name },
    });
    if (error) throw error;

    const userId = data.user.id;

    // Insert into public.profiles
    await admin.from('profiles').upsert({
      id: userId,
      full_name,
      email,
      organization_name,
      created_at: new Date().toISOString(),
    });

    // Insert into public.user_roles
    await admin.from('user_roles').upsert({
      user_id: userId,
      role,
      created_by: createdBy,
    });

    // Audit log
    await admin.from('audit_logs').insert({
      action: 'CREATE_ADMIN_USER',
      performed_by: createdBy,
      details: { email, role, organization_name, user_id: userId },
    });

    return data.user;
  },

  async forgotPassword(email) {
    const anon = getAnonClient();
    const { error } = await anon.auth.resetPasswordForEmail(email, {
      redirectTo: `${FRONTEND_URL}/reset-password`,
    });
    if (error) throw error;
  },
};

module.exports = authService;
