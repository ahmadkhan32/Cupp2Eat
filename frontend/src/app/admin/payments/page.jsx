'use client';
import { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const INITIAL_PAYMENTS = [
  { id: 'pay_1', rzp_payment_id: 'pay_O9x81k29s81a', order_id: 'ord-101', amount: 349, method: 'UPI (Google Pay)', status: 'captured', date: '2024-11-13 14:32' },
  { id: 'pay_2', rzp_payment_id: 'pay_O9x82k99a82b', order_id: 'ord-102', amount: 199, method: 'Credit Card (Visa)', status: 'captured', date: '2024-11-13 15:10' },
  { id: 'pay_3', rzp_payment_id: 'pay_O9x83m11c93c', order_id: 'ord-104', amount: 149, method: 'NetBanking (HDFC)', status: 'captured', date: '2024-11-12 18:20' },
  { id: 'pay_4', rzp_payment_id: 'pay_O9x84x00f04d', order_id: 'ord-105', amount: 499, method: 'UPI (PhonePe)', status: 'failed', date: '2024-11-12 19:04' },
];

export default function AdminPaymentsPage() {
  const [payments] = useState(INITIAL_PAYMENTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-charcoal">Razorpay Payment Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Audit online payment webhooks, UPI captures, and transaction receipts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            <tr>
              <th className="px-6 py-4">Transaction / Razorpay ID</th>
              <th className="px-6 py-4">Associated Order</th>
              <th className="px-6 py-4">Amount (INR)</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-xs text-brand-green">{p.rzp_payment_id}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600">{p.order_id}</td>
                <td className="px-6 py-4 font-extrabold text-brand-charcoal">{formatPrice(p.amount)}</td>
                <td className="px-6 py-4 text-xs font-medium text-gray-700">{p.method}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      p.status === 'captured'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.status === 'captured' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
