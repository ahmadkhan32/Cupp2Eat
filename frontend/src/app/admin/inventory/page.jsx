'use client';
import { useState } from 'react';
import { Warehouse, AlertTriangle, RefreshCw, Plus, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

const INITIAL_INVENTORY = [
  { id: 'inv-1', name: 'Masala Magic Cup (Spicy)', sku: 'C2E-NDL-MSL-01', stock: 45, reserved: 4, low_threshold: 10, status: 'good' },
  { id: 'inv-2', name: 'Tomato Twist Soup Cup', sku: 'C2E-SOP-TMT-01', stock: 28, reserved: 2, low_threshold: 10, status: 'good' },
  { id: 'inv-3', name: 'Belgian Chocolate Lava Cake', sku: 'C2E-DES-LAV-01', stock: 8, reserved: 5, low_threshold: 10, status: 'low' },
  { id: 'inv-4', name: 'Spicy Schezwan Hakka Cup', sku: 'C2E-NDL-SCH-01', stock: 4, reserved: 3, low_threshold: 10, status: 'critical' },
  { id: 'inv-5', name: 'Green Matcha Tea Cup', sku: 'C2E-BEV-MTC-01', stock: 52, reserved: 1, low_threshold: 15, status: 'good' },
];

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const handleRestock = (id) => {
    const qty = prompt('Enter quantity to restock:', '50');
    if (qty && !isNaN(qty)) {
      setInventory(
        inventory.map((item) =>
          item.id === id ? { ...item, stock: item.stock + Number(qty), status: 'good' } : item
        )
      );
      toast.success(`Restocked ${qty} units`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Inventory & Warehousing</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time variant stock tracking, reservation logs, and replenishment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Total Available Units</p>
            <h3 className="text-2xl font-extrabold text-brand-charcoal">137 Units</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-amber-600">Low Stock SKUs</p>
            <h3 className="text-2xl font-extrabold text-brand-charcoal">2 Items</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-purple-600">Reserved in Checkout</p>
            <h3 className="text-2xl font-extrabold text-brand-charcoal">15 Units</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              <tr>
                <th className="px-6 py-4">Item & Variant</th>
                <th className="px-6 py-4">SKU Code</th>
                <th className="px-6 py-4">In Stock</th>
                <th className="px-6 py-4">Reserved</th>
                <th className="px-6 py-4">Health Status</th>
                <th className="px-6 py-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-charcoal">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.sku}</td>
                  <td className="px-6 py-4 font-extrabold text-brand-charcoal">{item.stock}</td>
                  <td className="px-6 py-4 text-purple-600 font-semibold">{item.reserved}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.stock <= 5
                          ? 'bg-red-100 text-red-800'
                          : item.stock <= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.stock <= 5 ? 'Critical Low' : item.stock <= 10 ? 'Low Stock' : 'Healthy'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleRestock(item.id)}>
                      + Restock
                    </Button>
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
