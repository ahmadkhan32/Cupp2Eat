const supabase = require('../../config/supabase');

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

module.exports = {
  async getAll(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      res.json({ success: true, categories: data || [] });
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, products(*, product_images(image_url, is_primary))')
        .eq('slug', req.params.slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      res.json({ success: true, category: data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description, image_url } = req.body;
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          slug: slugify(name),
          description,
          image_url,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, category: data });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updates = { ...req.body, updated_at: new Date().toISOString() };
      if (updates.name) updates.slug = slugify(updates.name);

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, category: data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await supabase.from('categories').delete().eq('id', req.params.id);
      res.json({ success: true, message: 'Category removed' });
    } catch (err) {
      next(err);
    }
  },
};
