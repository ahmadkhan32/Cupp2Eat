import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const MOCK_ORDERS = [
  { id: 'ord-1', order_number: 'C2E-1234567890-ABC', created_at: '2024-11-10T10:00:00Z', total: 448, order_status: 'delivered', payment_status: 'paid', items: [{ name: 'Masala Maggi Cup', quantity: 2, unit_price: 149 }, { name: 'Tomato Basil Soup Cup', quantity: 1, unit_price: 129 }] },
  { id: 'ord-2', order_number: 'C2E-9876543210-XYZ', created_at: '2024-11-12T14:00:00Z', total: 169, order_status: 'processing', payment_status: 'paid', items: [{ name: 'Schezwan Noodle Cup', quantity: 1, unit_price: 169 }] },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  if (MOCK_ORDERS.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-charcoal mb-4">No orders yet</h2>
        <Link href="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-green mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8" /> My Orders
      </h1>
      <div className="space-y-4">
        {MOCK_ORDERS.map(order => (
          <Link key={order.id} href={`/account/orders/${order.id}`} className="card p-6 block group hover:border-brand-gold border-2 border-transparent transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                <div className="mt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-brand-charcoal">{item.name} × {item.quantity}</p>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
                  {order.order_status.toUpperCase()}
                </span>
                <p className="text-xl font-bold text-brand-green">{formatPrice(order.total)}</p>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-green transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
