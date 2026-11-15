const authService = require('./auth.service');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('../../config/env');

const authController = {
  async register(req, res, next) {
    try {
      const { email, password, full_name } = req.body;
      const data = await authService.register(email, password, full_name);
      res.status(201).json({
        success: true,
        message: 'Registration successful! Verification email has been sent.',
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: 'customer',
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          full_name: data.user.profile?.full_name,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      res.json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          ...req.user.profile,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({ success: true, message: 'Password recovery instructions sent to email.' });
    } catch (err) {
      next(err);
    }
  },

  // Google OAuth sync helper
  async syncGoogleUser(req, res, next) {
    try {
      const { user_id, email, full_name } = req.body;
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const { data: existing } = await admin.from('profiles').select('*').eq('id', user_id).maybeSingle();
      if (!existing) {
        await admin.from('profiles').insert({ id: user_id, full_name, email });
        await admin.from('user_roles').insert({ user_id, role: 'customer' });
      }

      const { data: roleRow } = await admin.from('user_roles').select('role').eq('user_id', user_id).maybeSingle();
      res.json({ success: true, role: roleRow?.role || 'customer' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
