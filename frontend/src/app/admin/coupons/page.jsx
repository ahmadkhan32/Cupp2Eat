'use client';
import { useState } from 'react';
import { Plus, Tag, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

const INITIAL_COUPONS = [
  { id: 'cpn-1', code: 'WELCOME10', type: 'percentage', value: 10, min_order: 199, uses: 142, max_uses: 500, active: true },
  { id: 'cpn-2', code: 'CUPFEST50', type: 'fixed', value: 50, min_order: 399, uses: 89, max_uses: 200, active: true },
  { id: 'cpn-3', code: 'GOLDEN20', type: 'percentage', value: 20, min_order: 599, uses: 45, max_uses: 100, active: false },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', type: 'percentage', value: 10, min_order: 299, max_uses: 100 });

  const handleCreate = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      min_order: Number(formData.min_order),
      max_uses: Number(formData.max_uses),
      uses: 0,
      active: true,
    };
    setCoupons([newCoupon, ...coupons]);
    toast.success(`Coupon ${newCoupon.code} created`);
    setIsModalOpen(false);
  };

  const toggleStatus = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
    toast.success('Coupon status updated');
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success('Coupon deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Promotional Coupons (CRUD)</h1>
          <p className="text-gray-500 text-sm mt-1">Create discount codes, set validity limits & minimum order carts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-gold" /> Create Discount Code
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-extrabold text-lg text-brand-green bg-brand-green/10 px-3 py-1 rounded-lg border border-brand-green/20">
                {c.code}
              </span>
              <button
                onClick={() => toggleStatus(c.id)}
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {c.active ? 'Active' : 'Disabled'}
              </button>
            </div>
            <p className="font-bold text-brand-charcoal text-base">
              {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
            </p>
            <p className="text-xs text-gray-500 mt-1">Min. cart value: ₹{c.min_order}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>{c.uses} / {c.max_uses} redemptions</span>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Discount Coupon">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Coupon Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. MONSOON20"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green uppercase font-mono"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Discount Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Discount Value</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Min. Cart Value (₹)</label>
              <input
                type="number"
                value={formData.min_order}
                onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Max Redemptions</label>
              <input
                type="number"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
