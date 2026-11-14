const supabase = require('../../config/supabase');

module.exports = {
  async validateCoupon(req, res, next) {
    try {
      const { code, cart_total } = req.body;
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        return res.status(404).json({ success: false, message: 'Invalid discount coupon code' });
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon code has expired' });
      }

      if (cart_total < coupon.min_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Minimum cart value of INR ${coupon.min_order_amount} required for this coupon.`,
        });
      }

      const discount =
        coupon.discount_type === 'percentage'
          ? (cart_total * coupon.discount_value) / 100
          : coupon.discount_value;

      res.json({ success: true, coupon, discount });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      res.json({ success: true, coupons: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert({ ...req.body, code: req.body.code.toUpperCase(), created_by: req.user.id })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, coupon: data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await supabase.from('coupons').delete().eq('id', req.params.id);
      res.json({ success: true, message: 'Coupon removed' });
    } catch (err) {
      next(err);
    }
  },
};
