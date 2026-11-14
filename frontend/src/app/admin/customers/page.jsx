'use client';
import { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const INITIAL_CUSTOMERS = [
  { id: 'c-1', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 98765 43210', total_orders: 5, spent: 1845, joined: '2024-02-12' },
  { id: 'c-2', name: 'Rahul Verma', email: 'rahul.v@gmail.com', phone: '+91 98765 12345', total_orders: 3, spent: 980, joined: '2024-04-18' },
  { id: 'c-3', name: 'Anjali Patel', email: 'anjali@gmail.com', phone: '+91 98765 67890', total_orders: 8, spent: 3410, joined: '2024-01-05' },
  { id: 'c-4', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 98765 99887', total_orders: 2, spent: 498, joined: '2024-07-22' },
];

export default function AdminCustomersPage() {
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-charcoal">Registered Customers</h1>
        <p className="text-gray-500 text-sm mt-1">View buyer profiles, purchase history, and contact details.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">{filtered.length} customers</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Orders Placed</th>
              <th className="px-6 py-4">Total Spent (INR)</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-charcoal flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center shrink-0">
                    {c.name[0]}
                  </div>
                  <div>
                    <p>{c.name}</p>
                    <p className="text-xs font-normal text-gray-400">ID: {c.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs space-y-0.5">
                  <p className="text-gray-700 flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" /> {c.email}</p>
                  <p className="text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {c.phone}</p>
                </td>
                <td className="px-6 py-4 font-bold text-brand-green">{c.total_orders} orders</td>
                <td className="px-6 py-4 font-extrabold text-brand-charcoal">{formatPrice(c.spent)}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
