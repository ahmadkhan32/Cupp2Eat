import Link from 'next/link';
import { ArrowLeft, Download, Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const MOCK_ORDER = {
  id: 'ord-1', order_number: 'C2E-1234567890-ABC', created_at: '2024-11-10T10:00:00Z',
  subtotal: 427, shipping_fee: 0, discount: 0, total: 427,
  order_status: 'delivered', payment_status: 'paid', payment_method: 'razorpay',
  shipping_address: { full_name: 'Rahul Verma', phone: '9876543210', house_no: 'Flat 302', street: 'MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400058' },
  items: [
    { id: '1', product_name: 'Masala Maggi Cup', variant_name: 'Original Masala', quantity: 2, unit_price: 149, total_price: 298 },
    { id: '2', product_name: 'Tomato Basil Soup Cup', variant_name: null, quantity: 1, unit_price: 129, total_price: 129 },
  ],
};

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage({ params }) {
  const order = MOCK_ORDER;
  const stepIdx = STATUS_STEPS.indexOf(order.order_status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/account/orders" className="flex items-center gap-2 text-brand-green hover:text-brand-gold mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Orders
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-green">Order #{order.order_number}</h1>
          <p className="text-gray-500">Placed on {formatDate(order.created_at)}</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Download Invoice
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-green" /> Order Status
        </h2>
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                i <= stepIdx ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <div className="ml-2 mr-2 flex-shrink-0">
                <p className={`text-xs font-medium capitalize ${i <= stepIdx ? 'text-brand-green' : 'text-gray-400'}`}>{step}</p>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${i < stepIdx ? 'bg-brand-green' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-charcoal mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium text-brand-charcoal">{item.product_name}</p>
                  {item.variant_name && <p className="text-sm text-gray-500">{item.variant_name}</p>}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-brand-green">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span></div>
            <div className="flex justify-between font-bold text-xl"><span>Total</span><span className="text-brand-green">{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-charcoal mb-4">Delivery Address</h2>
          <p className="font-semibold">{order.shipping_address.full_name}</p>
          <p className="text-gray-600">{order.shipping_address.house_no}, {order.shipping_address.street}</p>
          <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
          <p className="text-gray-600 mt-2">📱 {order.shipping_address.phone}</p>

          <div className="mt-6">
            <h3 className="font-bold text-brand-charcoal mb-2">Payment</h3>
            <p className="text-gray-600 capitalize">{order.payment_method} — <span className="text-green-600 font-semibold">{order.payment_status}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
