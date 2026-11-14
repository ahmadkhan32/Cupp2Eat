'use client';
import { useState } from 'react';
import { FileText, Download, Printer, Eye, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

const INITIAL_INVOICES = [
  { id: 'inv-101', invoice_number: 'INV-C2E-2024-9841', order_number: 'C2E-2024-9841', customer: 'Priya Sharma', amount: 349, date: '2024-11-13' },
  { id: 'inv-102', invoice_number: 'INV-C2E-2024-9842', order_number: 'C2E-2024-9842', customer: 'Rahul Verma', amount: 199, date: '2024-11-13' },
  { id: 'inv-103', invoice_number: 'INV-C2E-2024-9843', order_number: 'C2E-2024-9843', customer: 'Anjali Patel', amount: 598, date: '2024-11-12' },
];

export default function AdminInvoicesPage() {
  const [invoices] = useState(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Tax Invoices (PDF & GST)</h1>
          <p className="text-gray-500 text-sm mt-1">Official GST compliant order receipts and customer tax invoices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            <tr>
              <th className="px-6 py-4">Invoice Number</th>
              <th className="px-6 py-4">Associated Order</th>
              <th className="px-6 py-4">Billed To</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-xs text-brand-green">{inv.invoice_number}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600">{inv.order_number}</td>
                <td className="px-6 py-4 font-semibold text-brand-charcoal">{inv.customer}</td>
                <td className="px-6 py-4 font-bold text-brand-charcoal">{formatPrice(inv.amount)}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{inv.date}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View & Print Invoice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Downloading PDF for ${inv.invoice_number}`)}
                    className="p-1.5 text-brand-green hover:bg-brand-cream rounded-lg"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title="Tax Invoice Preview"
          maxWidth="max-w-2xl"
        >
          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-6 text-sm" id="printable-invoice">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-gold/40 pb-4">
              <div>
                <h2 className="font-extrabold text-2xl text-brand-green tracking-wider">CUP2EAT</h2>
                <p className="text-xs text-brand-charcoal italic font-medium">Eat Your Drink! • Artisan Foods</p>
                <p className="text-[11px] text-gray-500 mt-1">Connaught Place, New Delhi - 110001</p>
                <p className="text-[11px] text-gray-500">GSTIN: 07AAAAA0000A1Z5</p>
              </div>
              <div className="text-right">
                <span className="bg-brand-green text-brand-gold text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  Tax Invoice
                </span>
                <p className="font-mono text-xs font-bold text-brand-charcoal mt-2">{selectedInvoice.invoice_number}</p>
                <p className="text-xs text-gray-500">Date: {selectedInvoice.date}</p>
              </div>
            </div>

            {/* Bill to */}
            <div className="flex justify-between text-xs text-gray-600">
              <div>
                <p className="font-bold text-brand-charcoal uppercase tracking-wider">Billed To:</p>
                <p className="font-semibold text-sm text-brand-charcoal mt-1">{selectedInvoice.customer}</p>
                <p>Connaught Enclave, Plot 14, Delhi - 110001</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-charcoal uppercase tracking-wider">Order Reference:</p>
                <p className="font-mono font-semibold mt-1">{selectedInvoice.order_number}</p>
                <p>Payment Mode: Razorpay UPI</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-xs text-left border border-gray-200">
              <thead className="bg-brand-green text-brand-gold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2.5">Masala Magic Cup Noodles (90g)</td>
                  <td className="p-2.5 text-center">2</td>
                  <td className="p-2.5 text-right">₹119.00</td>
                  <td className="p-2.5 text-right font-medium">₹238.00</td>
                </tr>
                <tr>
                  <td className="p-2.5">Tomato Twist Artisan Soup Cup (80g)</td>
                  <td className="p-2.5 text-center">1</td>
                  <td className="p-2.5 text-right">₹111.00</td>
                  <td className="p-2.5 text-right font-medium">₹111.00</td>
                </tr>
              </tbody>
            </table>

            {/* Calculations */}
            <div className="flex justify-end text-xs space-y-1">
              <div className="w-48 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxable Value:</span>
                  <span>₹314.41</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CGST (2.5%):</span>
                  <span>₹7.86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SGST (2.5%):</span>
                  <span>₹7.86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-brand-green pt-2 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span>{formatPrice(selectedInvoice.amount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </Button>
              <Button size="sm" onClick={() => setSelectedInvoice(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
