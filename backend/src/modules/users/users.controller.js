const supabase = require('../../config/supabase');

module.exports = {
  async getProfile(req, res, next) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
      if (error) throw error;
      res.json({ success: true, profile: data });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { full_name, phone } = req.body;
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name, phone, updated_at: new Date().toISOString() })
        .eq('id', req.user.id)
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, profile: data });
    } catch (err) {
      next(err);
    }
  },

  async getAddresses(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', req.user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      res.json({ success: true, addresses: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async addAddress(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({ ...req.body, user_id: req.user.id })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, address: data });
    } catch (err) {
      next(err);
    }
  },

  async deleteAddress(req, res, next) {
    try {
      await supabase.from('addresses').delete().eq('id', req.params.id).eq('user_id', req.user.id);
      res.json({ success: true, message: 'Address removed' });
    } catch (err) {
      next(err);
    }
  },
};
