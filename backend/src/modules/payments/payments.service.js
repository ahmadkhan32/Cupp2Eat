const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../../config/supabase');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = require('../../config/env');

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const paymentsService = {
  async createRazorpayOrder(orderId, amount) {
    let rzpOrderId = `order_mock_${Date.now()}`;

    try {
      if (RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes('placeholder')) {
        const instance = getRazorpayInstance();
        const rzpOrder = await instance.orders.create({
          amount: Math.round(amount * 100), // convert to paise
          currency: 'INR',
          receipt: orderId,
          notes: { cup2eat_order_id: orderId },
        });
        rzpOrderId = rzpOrder.id;
      }
    } catch (e) {
      console.warn('Using fallback sandbox Razorpay ID:', e.message);
    }

    // Save payment record
    await supabase.from('payments').insert({
      order_id: orderId,
      razorpay_order_id: rzpOrderId,
      amount,
      currency: 'INR',
      status: 'created',
    });

    return {
      razorpay_order_id: rzpOrderId,
      key_id: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
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

    // Update payment record in database
    await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Update main order
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
