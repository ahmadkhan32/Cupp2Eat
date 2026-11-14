const productsService = require('./products.service');

module.exports = {
  async getAll(req, res, next) {
    try {
      const result = await productsService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getFeatured(req, res, next) {
    try {
      const products = await productsService.getFeatured();
      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const product = await productsService.getBySlug(req.params.slug);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, product });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const product = await productsService.create(req.body);
      res.status(201).json({ success: true, product });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const product = await productsService.update(req.params.id, req.body);
      res.json({ success: true, product });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await productsService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  },
};
