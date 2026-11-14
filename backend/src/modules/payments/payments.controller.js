const paymentsService = require('./payments.service');

module.exports = {
  async createOrder(req, res, next) {
    try {
      const { order_id, amount } = req.body;
      const order = await paymentsService.createRazorpayOrder(order_id, amount);
      res.json({ success: true, ...order });
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req, res, next) {
    try {
      await paymentsService.verifyPayment(req.body);
      res.json({ success: true, message: 'Payment successfully captured and verified' });
    } catch (err) {
      next(err);
    }
  },

  async webhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      await paymentsService.handleWebhook(req.body, signature);
      res.json({ status: 'ok' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
