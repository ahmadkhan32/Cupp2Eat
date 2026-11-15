const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../../config/supabase');
const {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_PAYMENT_METHOD_TYPES,
  STRIPE_UPI_ENABLED,
  CURRENCY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
  FRONTEND_URL,
} = require('../../config/env');

const getStripeInstance = () => {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('placeholder')) {
    throw new Error('Stripe Secret Key is not configured.');
  }
  return new Stripe(STRIPE_SECRET_KEY);
};

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const paymentsService = {
  // ==========================================
  // STRIPE PAYMENT GATEWAY (PRIMARY)
  // ==========================================

  /**
   * Create a Stripe Hosted Checkout Session
   * Best for web apps with 3D Secure / RBI compliance
   */
  async createStripeCheckoutSession({ orderId, amount, customerEmail, customerName, items = [] }) {
    const stripe = getStripeInstance();
    const currency = (CURRENCY || 'inr').toLowerCase();
    const amountInPaise = Math.round(Number(amount) * 100);

    const paymentMethodTypes = [...(STRIPE_PAYMENT_METHOD_TYPES || ['card'])];
    if (STRIPE_UPI_ENABLED && !paymentMethodTypes.includes('upi')) {
      paymentMethodTypes.push('upi');
    }

    // Build line items for Stripe Checkout
    let line_items = [];
    if (items && items.length > 0) {
      line_items = items.map((item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.name || item.product_name || 'CUP2EAT Artisan Product',
            description: item.variant_name || 'Artisan edible wafer cup',
            images: item.image_url ? [item.image_url] : [],
          },
          unit_amount: Math.round(Number(item.price || item.unit_price) * 100),
        },
        quantity: item.quantity || 1,
      }));
    } else {
      line_items = [
        {
          price_data: {
            currency,
            product_data: {
              name: `CUP2EAT Order #${orderId ? orderId.slice(0, 8) : Date.now()}`,
              description: 'Premium artisan wafer cups & culinary items',
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      mode: 'payment',
      line_items,
      customer_email: customerEmail || undefined,
      client_reference_id: orderId,
      metadata: {
        order_id: orderId,
        customer_email: customerEmail || '',
        customer_name: customerName || '',
      },
      success_url: `${FRONTEND_URL}/account/orders?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&payment=success`,
      cancel_url: `${FRONTEND_URL}/checkout?order_id=${orderId}&payment=cancelled`,
    });

    // Record payment attempt in Supabase
    try {
      await supabase.from('payments').insert({
        order_id: orderId,
        amount: Number(amount),
        currency: currency.toUpperCase(),
        method: 'stripe',
        status: 'created',
        razorpay_order_id: session.id, // Store session ID for lookup
      });
    } catch (dbErr) {
      console.warn('Could not insert initial payment row in database:', dbErr.message);
    }

    return {
      url: session.url,
      sessionId: session.id,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
    };
  },

  /**
   * Create a Stripe PaymentIntent (for Custom Card Elements / Mobile)
   */
  async createStripePaymentIntent({ orderId, amount, customerEmail }) {
    const stripe = getStripeInstance();
    const currency = (CURRENCY || 'inr').toLowerCase();
    const amountInPaise = Math.round(Number(amount) * 100);

    const paymentMethodTypes = [...(STRIPE_PAYMENT_METHOD_TYPES || ['card'])];
    if (STRIPE_UPI_ENABLED && !paymentMethodTypes.includes('upi')) {
      paymentMethodTypes.push('upi');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        order_id: orderId,
        customer_email: customerEmail || '',
      },
      description: `CUP2EAT Order #${orderId}`,
    });

    try {
      await supabase.from('payments').insert({
        order_id: orderId,
        amount: Number(amount),
        currency: currency.toUpperCase(),
        method: 'stripe',
        status: 'created',
        razorpay_order_id: paymentIntent.id,
      });
    } catch (dbErr) {
      console.warn('Could not insert payment record for intent:', dbErr.message);
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
    };
  },

  /**
   * Verify a Stripe PaymentIntent or Checkout Session
   */
  async verifyStripePayment({ paymentIntentId, sessionId, orderId }) {
    const stripe = getStripeInstance();

    let isSuccess = false;
    let paymentId = '';

    if (paymentIntentId) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      isSuccess = intent.status === 'succeeded';
      paymentId = intent.id;
    } else if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      isSuccess = session.payment_status === 'paid';
      paymentId = session.payment_intent || session.id;
      if (!orderId) {
        orderId = session.client_reference_id || session.metadata?.order_id;
      }
    }

    if (!isSuccess) {
      throw new Error('Stripe payment has not been successfully captured yet.');
    }

    // Update database records
    if (orderId) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      await supabase
        .from('payments')
        .update({
          razorpay_payment_id: paymentId,
          status: 'captured',
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', orderId);
    }

    return {
      success: true,
      status: 'paid',
      orderId,
      paymentId,
    };
  },

  /**
   * Stripe Webhook Handler with Signature Verification
   */
  async handleStripeWebhook(rawBody, signature) {
    const stripe = getStripeInstance();
    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`⚠️ Stripe Webhook signature verification failed:`, err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    console.log(`🔔 Stripe Webhook Received: [${event.type}]`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.order_id;

        if (orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              order_status: 'confirmed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payments')
            .update({
              razorpay_payment_id: session.payment_intent || session.id,
              status: 'captured',
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId);
          console.log(`✅ Order ${orderId} marked as paid via Stripe Checkout Session`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const orderId = intent.metadata?.order_id;

        if (orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              order_status: 'confirmed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payments')
            .update({
              razorpay_payment_id: intent.id,
              status: 'captured',
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId);
          console.log(`✅ Order ${orderId} marked as paid via Stripe PaymentIntent`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        const orderId = intent.metadata?.order_id;

        if (orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payments')
            .update({
              status: 'failed',
              error_code: intent.last_payment_error?.code,
              error_description: intent.last_payment_error?.message,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    return true;
  },

  // ==========================================
  // RAZORPAY PAYMENT GATEWAY (FALLBACK)
  // ==========================================

  async createRazorpayOrder(orderId, amount) {
    let rzpOrderId = `order_mock_${Date.now()}`;

    try {
      if (RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes('placeholder')) {
        const instance = getRazorpayInstance();
        const rzpOrder = await instance.orders.create({
          amount: Math.round(Number(amount) * 100),
          currency: 'INR',
          receipt: orderId,
          notes: { cup2eat_order_id: orderId },
        });
        rzpOrderId = rzpOrder.id;
      }
    } catch (e) {
      console.warn('Using fallback sandbox Razorpay ID:', e.message);
    }

    await supabase.from('payments').insert({
      order_id: orderId,
      razorpay_order_id: rzpOrderId,
      amount: Number(amount),
      currency: 'INR',
      method: 'razorpay',
      status: 'created',
    });

    return {
      razorpay_order_id: rzpOrderId,
      key_id: RAZORPAY_KEY_ID,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
    };
  },

  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }) {
    if (RAZORPAY_KEY_SECRET && !RAZORPAY_KEY_SECRET.includes('placeholder')) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new Error('Payment signature verification failed. Potential tampering.');
      }
    }

    await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    return true;
  },

  async handleWebhook(rawBody, signature) {
    if (RAZORPAY_WEBHOOK_SECRET && !RAZORPAY_WEBHOOK_SECRET.includes('placeholder')) {
      const expected = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expected !== signature) {
        throw new Error('Invalid webhook signature');
      }
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;

      const { data: payment } = await supabase
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', rzpOrderId)
        .single();

      if (payment) {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', order_status: 'confirmed' })
          .eq('id', payment.order_id);
      }
    }

    return true;
  },
};

module.exports = paymentsService;
