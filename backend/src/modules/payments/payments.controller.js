const paymentsService = require('./payments.service');

module.exports = {
  // ==========================================
  // STRIPE CONTROLLERS
  // ==========================================

  async createStripeSession(req, res, next) {
    try {
      const { order_id, amount, customer_email, customer_name, items } = req.body;
      if (!order_id || !amount) {
        return res.status(400).json({ success: false, message: 'order_id and amount are required' });
      }

      const session = await paymentsService.createStripeCheckoutSession({
        orderId: order_id,
        amount,
        customerEmail: customer_email || req.user?.email,
        customerName: customer_name || req.user?.user_metadata?.full_name,
        items,
      });

      res.json({ success: true, ...session });
    } catch (err) {
      next(err);
    }
  },

  async createStripeIntent(req, res, next) {
    try {
      const { order_id, amount, customer_email } = req.body;
      if (!order_id || !amount) {
        return res.status(400).json({ success: false, message: 'order_id and amount are required' });
      }

      const intent = await paymentsService.createStripePaymentIntent({
        orderId: order_id,
        amount,
        customerEmail: customer_email || req.user?.email,
      });

      res.json({ success: true, ...intent });
    } catch (err) {
      next(err);
    }
  },

  async verifyStripePayment(req, res, next) {
    try {
      const { payment_intent_id, session_id, order_id } = req.body;
      const result = await paymentsService.verifyStripePayment({
        paymentIntentId: payment_intent_id,
        sessionId: session_id,
        orderId: order_id,
      });

      res.json({
        success: true,
        message: 'Stripe payment successfully verified and captured',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },

  async stripeWebhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
      }

      await paymentsService.handleStripeWebhook(req.body, signature);
      res.json({ received: true });
    } catch (err) {
      console.error('Stripe webhook processing error:', err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ==========================================
  // UNIFIED PAYMENT DISPATCHER
  // ==========================================

  async createPayment(req, res, next) {
    try {
      const { provider = 'stripe', order_id, amount, customer_email, customer_name, items } = req.body;

      if (provider === 'razorpay') {
        const order = await paymentsService.createRazorpayOrder(order_id, amount);
        return res.json({ success: true, provider: 'razorpay', ...order });
      }

      // Default: Stripe
      const session = await paymentsService.createStripeCheckoutSession({
        orderId: order_id,
        amount,
        customerEmail: customer_email || req.user?.email,
        customerName: customer_name || req.user?.user_metadata?.full_name,
        items,
      });

      res.json({ success: true, provider: 'stripe', ...session });
    } catch (err) {
      next(err);
    }
  },

  // ==========================================
  // RAZORPAY CONTROLLERS (LEGACY / FALLBACK)
  // ==========================================

  async createOrder(req, res, next) {
    try {
      const { order_id, amount, provider } = req.body;
      if (provider === 'stripe') {
        const session = await paymentsService.createStripeCheckoutSession({
          orderId: order_id,
          amount,
          customerEmail: req.user?.email,
        });
        return res.json({ success: true, ...session });
      }

      const order = await paymentsService.createRazorpayOrder(order_id, amount);
      res.json({ success: true, ...order });
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req, res, next) {
    try {
      const { provider, payment_intent_id, session_id, order_id } = req.body;

      if (provider === 'stripe' || payment_intent_id || session_id) {
        const result = await paymentsService.verifyStripePayment({
          paymentIntentId: payment_intent_id,
          sessionId: session_id,
          orderId: order_id,
        });
        return res.json({ success: true, message: 'Stripe payment verified', ...result });
      }

      await paymentsService.verifyPayment(req.body);
      res.json({ success: true, message: 'Payment successfully captured and verified' });
    } catch (err) {
      next(err);
    }
  },

  async webhook(req, res, next) {
    try {
      // Check if Stripe or Razorpay based on headers
      if (req.headers['stripe-signature']) {
        await paymentsService.handleStripeWebhook(req.body, req.headers['stripe-signature']);
        return res.json({ received: true });
      }

      const signature = req.headers['x-razorpay-signature'];
      await paymentsService.handleWebhook(req.body, signature);
      res.json({ status: 'ok' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
