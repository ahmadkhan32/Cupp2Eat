const app = require('./app');
const {
  PORT,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  CURRENCY,
  STRIPE_PAYMENT_METHOD_TYPES,
  STRIPE_UPI_ENABLED,
} = require('./config/env');

// Payment Setup status check
const isStripeConfigured = STRIPE_SECRET_KEY && !STRIPE_SECRET_KEY.includes('placeholder');
const isStripeWebhookConfigured = STRIPE_WEBHOOK_SECRET && !STRIPE_WEBHOOK_SECRET.includes('placeholder');

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🍵 CUP2EAT Backend API running on port ${PORT}`);
    console.log(`✨ Health Check: http://localhost:${PORT}/health`);
    console.log(`💳 Stripe Gateway: ${isStripeConfigured ? 'READY (Configured)' : 'NOT CONFIGURED'}`);
    console.log(`🔒 Stripe Webhook: ${isStripeWebhookConfigured ? 'CONFIGURED' : 'PLACEHOLDER'}`);
    console.log(`🇮🇳 Currency: ${(CURRENCY || 'inr').toUpperCase()} | Methods: ${(STRIPE_PAYMENT_METHOD_TYPES || []).join(', ')} | UPI: ${STRIPE_UPI_ENABLED}`);
  });
}

// Export for Vercel Serverless Function deployment
module.exports = app;
