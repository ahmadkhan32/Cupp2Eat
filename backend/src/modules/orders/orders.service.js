const supabase = require('../../config/supabase');

const DEFAULT_CUSTOMER_ID = 'd0b77ee9-0464-4560-9924-3a9753538417';

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `C2E-${timestamp}-${random}`;
}

const ordersService = {
  async placeOrder(customerId, { items, shipping_address, payment_method, coupon_code }) {
    let subtotal = 0;
    const orderItems = [];

    // Verify each item and prices
    for (const item of items) {
      const { data: prod } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', item.product_id)
        .single();

      if (!prod) throw new Error(`Product not found: ${item.product_id}`);

      let unitPrice = prod.sale_price || prod.base_price;
      let variantName = '';

      if (item.variant_id) {
        const variant = prod.product_variants?.find((v) => v.id === item.variant_id);
        if (variant) {
          unitPrice += variant.price_adjustment || 0;
          variantName = variant.name || variant.flavour;
        }
      }

      const totalItemPrice = unitPrice * item.quantity;
      subtotal += totalItemPrice;

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: prod.name,
        variant_name: variantName,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalItemPrice,
      });
    }

    const shippingFee = subtotal >= 499 ? 0 : 49;
    let discount = 0;

    // Apply coupon if valid
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (coupon && subtotal >= coupon.min_order_amount) {
        discount =
          coupon.discount_type === 'percentage'
            ? (subtotal * coupon.discount_value) / 100
            : coupon.discount_value;
      }
    }

    const total = Math.max(0, subtotal + shippingFee - discount);
    const orderNumber = generateOrderNumber();
    const resolvedCustomerId = customerId || DEFAULT_CUSTOMER_ID;

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: resolvedCustomerId,
        subtotal,
        shipping_fee: shippingFee,
        discount,
        tax_amount: Number((total * 0.05).toFixed(2)),
        total,
        currency: 'INR',
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'pending',
        order_status: payment_method === 'cod' ? 'confirmed' : 'pending',
        shipping_address: {
          ...shipping_address,
          email: shipping_address?.email || null,
          phone: shipping_address?.phone || null,
        },
        coupon_code,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Insert order items
    const itemsPayload = orderItems.map((i) => ({ ...i, order_id: order.id }));
    await supabase.from('order_items').insert(itemsPayload);

    // Generate Invoice record
    const invoiceNumber = `INV-${orderNumber}`;
    try {
      await supabase.from('invoices').insert({
        order_id: order.id,
        invoice_number: invoiceNumber,
        tax_breakdown: {
          cgst: Number((total * 0.025).toFixed(2)),
          sgst: Number((total * 0.025).toFixed(2)),
          total_tax: Number((total * 0.05).toFixed(2)),
          subtotal,
          total,
        },
      });
    } catch (invErr) {
      console.warn('Invoice insertion warning:', invErr.message);
    }

    // Clear cart if authenticated
    if (customerId) {
      const { data: cart } = await supabase.from('carts').select('id').eq('user_id', customerId).maybeSingle();
      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      }
    }

    return { order, orderNumber, invoiceNumber };
  },

  async getMyOrders(customerId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(orderId, customerId) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*), invoices(*), shipments(*)')
      .eq('id', orderId);

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  },

  async trackOrder(orderNumber) {
    const { data, error } = await supabase
      .from('orders')
      .select('order_number, order_status, payment_status, created_at, shipments(*)')
      .eq('order_number', orderNumber)
      .single();

    if (error) throw error;
    return data;
  },
};

module.exports = ordersService;
