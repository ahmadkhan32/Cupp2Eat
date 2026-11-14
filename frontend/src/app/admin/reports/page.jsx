'use client';
import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/common/Button';

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Financial & Sales Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Exportable sales reports, GST breakdowns, and revenue performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">This Month (Nov 2024)</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Financial Year 2024-25</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2 text-xs">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Gross Sales</p>
          <h3 className="text-2xl font-extrabold text-brand-charcoal mt-1">₹4,01,290</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2">↑ 24.8% vs last month</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Total Orders</p>
          <h3 className="text-2xl font-extrabold text-brand-charcoal mt-1">804</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2">↑ 18.2% conversion</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Avg. Order Value</p>
          <h3 className="text-2xl font-extrabold text-brand-charcoal mt-1">₹499.11</h3>
          <p className="text-xs text-gray-500 mt-2">Healthy basket size</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs uppercase font-bold text-gray-400">Collected GST (5%)</p>
          <h3 className="text-2xl font-extrabold text-brand-charcoal mt-1">₹20,064</h3>
          <p className="text-xs text-gray-500 mt-2">CGST: ₹10,032 | SGST: ₹10,032</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-brand-charcoal text-base mb-4">Top Performing Products</h3>
        <div className="space-y-4">
          {[
            { name: 'Masala Magic Cup Noodles', sold: 412, revenue: 49028, share: '38%' },
            { name: 'Belgian Chocolate Lava Cup Cake', sold: 218, revenue: 36842, share: '28%' },
            { name: 'Tomato Twist Soup Cup', sold: 195, revenue: 15405, share: '18%' },
            { name: 'Green Matcha Tea Cup', sold: 110, revenue: 10890, share: '16%' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-bold text-brand-charcoal">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sold} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-brand-green">{formatPrice(item.revenue)}</p>
                <p className="text-xs text-gray-400">{item.share} of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
