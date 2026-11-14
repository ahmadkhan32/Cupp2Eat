import StatsCard from '@/components/admin/StatsCard';
import { ShoppingBag, Users, DollarSign, TrendingUp, Package, Star } from 'lucide-react';

const STATS = [
  { title: 'Total Revenue', value: '₹2,45,890', change: '+18.2%', icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-green' },
  { title: 'Total Orders', value: '1,284', change: '+12.5%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Total Customers', value: '10,432', change: '+8.1%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Products', value: '48', change: '+3', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const RECENT_ORDERS = [
  { id: 'C2E-001', customer: 'Priya Sharma', amount: 448, status: 'delivered', date: '2024-11-13' },
  { id: 'C2E-002', customer: 'Rahul Verma', amount: 169, status: 'processing', date: '2024-11-13' },
  { id: 'C2E-003', customer: 'Anjali Nair', amount: 627, status: 'shipped', date: '2024-11-12' },
  { id: 'C2E-004', customer: 'Vikram Singh', amount: 199, status: 'pending', date: '2024-11-12' },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-charcoal">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with CUP2EAT.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map(stat => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-charcoal">Recent Orders</h2>
          <a href="/admin/orders" className="text-brand-green hover:text-brand-gold text-sm font-semibold transition-colors">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-sm font-semibold text-gray-500 pb-3">Order ID</th>
                <th className="text-left text-sm font-semibold text-gray-500 pb-3">Customer</th>
                <th className="text-left text-sm font-semibold text-gray-500 pb-3">Amount</th>
                <th className="text-left text-sm font-semibold text-gray-500 pb-3">Status</th>
                <th className="text-left text-sm font-semibold text-gray-500 pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_ORDERS.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-mono text-sm text-brand-green">{order.id}</td>
                  <td className="py-4 font-medium text-brand-charcoal">{order.customer}</td>
                  <td className="py-4 font-semibold">₹{order.amount}</td>
                  <td className="py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500 text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
