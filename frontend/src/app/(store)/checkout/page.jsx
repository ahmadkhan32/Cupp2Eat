'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/schemas/auth';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice } from '@/lib/utils';
import { clearCart } from '@/features/cart/cartSlice';
import { CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const shippingFee = total >= 499 ? 0 : 60;
  const grandTotal = total + shippingFee;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: 'razorpay' },
  });

  const onSubmit = async (data) => {
    try {
      toast.loading('Processing your order...');
      await new Promise(r => setTimeout(r, 1500));
      toast.dismiss();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push('/account/orders');
    } catch (err) {
      toast.error('Order failed. Please try again.');
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-green mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input {...register('full_name')} className="input-field" placeholder="Your full name" />
                  {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input {...register('phone')} className="input-field" placeholder="10-digit mobile number" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-green" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat/Building *</label>
                  <input {...register('house_no')} className="input-field" placeholder="House No, Building, Apartment" />
                  {errors.house_no && <p className="text-red-500 text-sm mt-1">{errors.house_no.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street/Area/Locality *</label>
                  <input {...register('street')} className="input-field" placeholder="Street, Area, Locality" />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input {...register('city')} className="input-field" placeholder="City" />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input {...register('state')} className="input-field" placeholder="State" />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <input {...register('pincode')} className="input-field" placeholder="6-digit PIN code" />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
                  <input {...register('delivery_instructions')} className="input-field" placeholder="Optional instructions" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-green" /> Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-brand-green transition-colors">
                  <input {...register('payment_method')} type="radio" value="razorpay" className="text-brand-green" />
                  <div>
                    <p className="font-semibold">Razorpay</p>
                    <p className="text-sm text-gray-500">Pay with UPI, Cards, Net Banking, Wallets</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-brand-green transition-colors">
                  <input {...register('payment_method')} type="radio" value="cod" className="text-brand-green" />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit">
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={`${item.id}-${item.variantId}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-brand-green">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Processing...' : `Pay ${formatPrice(grandTotal)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
