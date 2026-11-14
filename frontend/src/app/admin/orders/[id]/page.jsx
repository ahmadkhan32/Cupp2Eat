'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, CheckCircle2, Clock, MapPin, CreditCard, User, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import { formatPrice } from '@/lib/utils';

export default function AdminOrderDetailPage({ params }) {
  const [courier, setCourier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('BD928301928IN');
  const [orderStatus, setOrderStatus] = useState('processing');

  const handleUpdateShipping = (e) => {
    e.preventDefault();
    toast.success('Courier and tracking details updated. Customer notified via WhatsApp/Email.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-brand-charcoal">Order #C2E-2024-9842</h1>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {orderStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Placed on 13 Nov 2024 at 14:32 IST</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-green" /> Download Invoice (PDF)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: Order items & pricing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-brand-charcoal text-base mb-4">Items Ordered</h3>
            <div className="divide-y divide-gray-100">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-brand-charcoal">Masala Magic Cup Noodles</p>
                  <p className="text-xs text-gray-500">Flavour: Extra Spicy • Pack of 2</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-brand-green">₹238.00</p>
                  <p className="text-xs text-gray-400">2 × ₹119.00</p>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-brand-charcoal">Tomato Twist Soup Cup</p>
                  <p className="text-xs text-gray-500">Flavour: Classic Basil • Regular 80g</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-brand-green">₹79.00</p>
                  <p className="text-xs text-gray-400">1 × ₹79.00</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹317.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 font-medium">FREE (Above ₹499 offer)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount (Coupon: WELCOME10)</span>
                <span className="text-red-500">-₹31.70</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-brand-charcoal pt-2 border-t border-gray-100">
                <span>Total Payable</span>
                <span className="text-brand-green text-lg">₹285.30</span>
              </div>
            </div>
          </div>

          {/* Shipping & Courier Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-brand-charcoal text-base mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-gold" /> Shipment & Courier Dispatch
            </h3>
            <form onSubmit={handleUpdateShipping} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
                  placeholder="e.g. Delhivery, BlueDart"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">AWB / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-green"
                  placeholder="AWB123456789"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" size="sm" className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Save & Notify Customer
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right col: Customer, Address & Payment */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
              <User className="w-4 h-4 text-brand-gold" /> Customer Profile
            </h3>
            <div>
              <p className="font-bold text-sm text-brand-charcoal">Rahul Verma</p>
              <p className="text-xs text-gray-500">rahul.v@gmail.com</p>
              <p className="text-xs text-gray-500 mt-1">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-gold" /> Shipping Address
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Flat 402, Green Heights, SV Road, Bandra West,<br />
              Mumbai, Maharashtra - 400050<br />
              India
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-gold" /> Payment Verification
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Gateway:</span>
                <span className="font-bold text-brand-charcoal">Razorpay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-mono text-gray-700">pay_O9x81k29s81a</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">● Captured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
