'use client';
import { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_ADDRESSES = [
  { id: '1', full_name: 'Rahul Verma', phone: '9876543210', house_no: 'Flat 302, Sunrise Apartments', street: 'MG Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400058', is_default: true },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-brand-green flex items-center gap-3">
          <MapPin className="w-8 h-8" /> My Addresses
        </h1>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className="card p-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-brand-charcoal">{addr.full_name}</h3>
                  {addr.is_default && <span className="bg-brand-green text-brand-gold text-xs px-2 py-1 rounded-full font-semibold">Default</span>}
                </div>
                <p className="text-gray-600">{addr.house_no}, {addr.street}</p>
                <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-gray-600 mt-1">📱 {addr.phone}</p>
              </div>
              <button onClick={() => { setAddresses(a => a.filter(x => x.id !== addr.id)); toast.success('Address removed'); }}
                className="text-red-400 hover:text-red-600 transition-colors h-fit">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
