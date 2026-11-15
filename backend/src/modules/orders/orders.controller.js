const ordersService = require('./orders.service');

module.exports = {
  async placeOrder(req, res, next) {
    try {
      const customerId = req.user?.id || null;
      const result = await ordersService.placeOrder(customerId, req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const orders = await ordersService.getMyOrders(req.user.id);
      res.json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const order = await ordersService.getById(req.params.id, req.user.id);
      res.json({ success: true, order });
    } catch (err) {
      next(err);
    }
  },

  async trackOrder(req, res, next) {
    try {
      const order = await ordersService.trackOrder(req.params.number);
      res.json({ success: true, order });
    } catch (err) {
      next(err);
    }
  },
};
