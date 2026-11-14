'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Store, Shield, CreditCard, MessageCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

export default function AdminSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    store_name: 'CUP2EAT',
    tagline: 'Eat Your Drink!',
    support_email: 'hello@cup2eat.com',
    support_phone: '+91 99999 99999',
    currency: 'INR (₹)',
    free_shipping_threshold: 499,
    standard_shipping_fee: 49,
    gstin: '07AAAAA0000A1Z5',
    razorpay_key_id: 'rzp_test_YourSandboxKey123',
    whatsapp_active: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Store configuration saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-charcoal">Store Configuration & Master Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure brand parameters, payment gateway credentials, and delivery thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Store className="w-5 h-5 text-brand-green" />
            <h3 className="font-bold text-brand-charcoal text-base">Brand Identity</h3>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-green shrink-0">
              <Image src="/logo/cup2eat-logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-sm text-brand-charcoal">Current Store Logo</p>
              <p className="text-xs text-gray-500">Official metallic gold & emerald green insignia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={storeSettings.store_name}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Slogan / Tagline</label>
              <input
                type="text"
                value={storeSettings.tagline}
                onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <CreditCard className="w-5 h-5 text-brand-green" />
            <h3 className="font-bold text-brand-charcoal text-base">Razorpay Online Gateway</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={storeSettings.razorpay_key_id}
                onChange={(e) => setStoreSettings({ ...storeSettings, razorpay_key_id: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg font-mono text-xs focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={storeSettings.gstin}
                onChange={(e) => setStoreSettings({ ...storeSettings, gstin: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg font-mono text-xs focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Support */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <MessageCircle className="w-5 h-5 text-brand-green" />
            <h3 className="font-bold text-brand-charcoal text-base">Fulfillment & WhatsApp Support</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Free Delivery Cart Threshold (₹)</label>
              <input
                type="number"
                value={storeSettings.free_shipping_threshold}
                onChange={(e) => setStoreSettings({ ...storeSettings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">WhatsApp Customer Care Phone</label>
              <input
                type="text"
                value={storeSettings.support_phone}
                onChange={(e) => setStoreSettings({ ...storeSettings, support_phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
