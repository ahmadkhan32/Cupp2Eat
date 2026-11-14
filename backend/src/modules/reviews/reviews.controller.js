const supabase = require('../../config/supabase');

module.exports = {
  async getProductReviews(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', req.params.productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ success: true, reviews: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async createReview(req, res, next) {
    try {
      const { product_id, rating, title, body, order_id } = req.body;
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id,
          user_id: req.user.id,
          order_id,
          rating,
          title,
          body,
          is_approved: true, // auto approve or set false for moderation
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, review: data });
    } catch (err) {
      next(err);
    }
  },

  async approveReview(req, res, next) {
    try {
      await supabase.from('reviews').update({ is_approved: true }).eq('id', req.params.id);
      res.json({ success: true, message: 'Review approved' });
    } catch (err) {
      next(err);
    }
  },

  async deleteReview(req, res, next) {
    try {
      await supabase.from('reviews').delete().eq('id', req.params.id);
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  },
};
