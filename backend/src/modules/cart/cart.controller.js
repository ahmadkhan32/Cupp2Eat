const supabase = require('../../config/supabase');

module.exports = {
  async getCart(req, res, next) {
    try {
      let { data: cart } = await supabase
        .from('carts')
        .select('*, cart_items(*, products(name, slug, base_price, sale_price, product_images(image_url, is_primary)), product_variants(name, flavour, size))')
        .eq('user_id', req.user.id)
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: req.user.id })
          .select()
          .single();
        cart = { ...newCart, cart_items: [] };
      }

      res.json({ success: true, cart });
    } catch (err) {
      next(err);
    }
  },

  async addItem(req, res, next) {
    try {
      const { product_id, variant_id, quantity = 1 } = req.body;
      let { data: cart } = await supabase.from('carts').select('id').eq('user_id', req.user.id).single();

      if (!cart) {
        const { data: newCart } = await supabase.from('carts').insert({ user_id: req.user.id }).select().single();
        cart = newCart;
      }

      // Check product price
      const { data: product } = await supabase.from('products').select('base_price, sale_price').eq('id', product_id).single();
      let price = product?.sale_price || product?.base_price || 0;

      if (variant_id) {
        const { data: variant } = await supabase.from('product_variants').select('price_adjustment').eq('id', variant_id).single();
        if (variant) price += variant.price_adjustment || 0;
      }

      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', product_id)
        .eq('variant_id', variant_id || null)
        .single();

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({ cart_id: cart.id, product_id, variant_id, quantity, price_snapshot: price });
      }

      res.json({ success: true, message: 'Item added to cart' });
    } catch (err) {
      next(err);
    }
  },

  async updateItem(req, res, next) {
    try {
      const { quantity } = req.body;
      if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', req.params.id);
        return res.json({ success: true, message: 'Item removed from cart' });
      }

      await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', req.params.id);

      res.json({ success: true, message: 'Cart quantity updated' });
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req, res, next) {
    try {
      await supabase.from('cart_items').delete().eq('id', req.params.id);
      res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
      next(err);
    }
  },
};
