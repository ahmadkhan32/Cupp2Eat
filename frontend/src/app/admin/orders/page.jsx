'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'C2E-2024-9841',
    customer_name: 'Priya Sharma',
    customer_email: 'priya@gmail.com',
    total: 349,
    payment_method: 'Razorpay UPI',
    payment_status: 'paid',
    order_status: 'delivered',
    created_at: '2024-11-13',
    items_count: 3,
  },
  {
    id: 'ord-102',
    order_number: 'C2E-2024-9842',
    customer_name: 'Rahul Verma',
    customer_email: 'rahul.v@gmail.com',
    total: 199,
    payment_method: 'Razorpay Card',
    payment_status: 'paid',
    order_status: 'processing',
    created_at: '2024-11-13',
    items_count: 1,
  },
  {
    id: 'ord-103',
    order_number: 'C2E-2024-9843',
    customer_name: 'Anjali Patel',
    customer_email: 'anjali@gmail.com',
    total: 598,
    payment_method: 'Cash on Delivery',
    payment_status: 'pending',
    order_status: 'shipped',
    created_at: '2024-11-12',
    items_count: 4,
  },
  {
    id: 'ord-104',
    order_number: 'C2E-2024-9844',
    customer_name: 'Vikram Singh',
    customer_email: 'vikram.singh@gmail.com',
    total: 149,
    payment_method: 'Razorpay NetBanking',
    payment_status: 'paid',
    order_status: 'pending',
    created_at: '2024-11-12',
    items_count: 1,
  },
];

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track, process, update fulfillment and shipping.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-green"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-brand-green">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-brand-charcoal">{o.customer_name}</p>
                    <p className="text-xs text-gray-400">{o.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-charcoal">{formatPrice(o.total)}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <span className="font-medium text-gray-700">{o.payment_method}</span>
                      <span
                        className={`block font-bold text-[10px] uppercase mt-0.5 ${
                          o.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        ● {o.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={o.order_status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                        statusStyles[o.order_status] || 'bg-gray-100'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{o.created_at}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/invoices`}
                      className="inline-flex p-1.5 text-brand-green hover:bg-brand-cream rounded-lg transition-colors"
                      title="Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
