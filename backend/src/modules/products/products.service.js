const supabase = require('../../config/supabase');

const productsService = {
  async getAll({ page = 1, limit = 20, category, search, sort = 'created_at', order = 'desc' }) {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(image_url, is_primary), product_variants(id, name, flavour, size, price_adjustment)', { count: 'exact' })
      .eq('is_published', true);

    if (category) {
      query = query.eq('categories.slug', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.order(sort, { ascending: order === 'asc' }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { products: data || [], total: count || 0, page: Number(page), limit: Number(limit) };
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(*), product_variants(*, inventory(quantity, reserved_quantity)), reviews(id, rating, title, body, created_at, profiles(full_name))')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    return data;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug), product_images(image_url, is_primary)')
      .eq('is_featured', true)
      .eq('is_published', true)
      .limit(8);

    if (error) throw error;
    return data || [];
  },

  async create(payload) {
    const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data, error } = await supabase
      .from('products')
      .insert({ ...payload, slug })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    if (payload.name && !payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

module.exports = productsService;
