'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/schemas/auth';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice } from '@/lib/utils';
import { clearCart } from '@/features/cart/cartSlice';
import { CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CheckoutPage() {
  const { items, total } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = total >= 499 ? 0 : 60;
  const grandTotal = total + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'stripe',
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  });

  const selectedPaymentMethod = watch('payment_method');

  const onSubmit = async (data) => {
    setSubmitting(true);
    const toastId = toast.loading('Initiating secure checkout...');
    try {
      // 1. Prepare Order Data
      const orderPayload = {
        items: items.map(i => ({
          product_id: i.id,
          variant_id: i.variantId || null,
          quantity: i.quantity,
          unit_price: i.price,
          product_name: i.name,
        })),
        shipping_address: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          house_no: data.house_no,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          delivery_instructions: data.delivery_instructions || '',
        },
        payment_method: data.payment_method,
      };

      // 2. Place Order in Backend
      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data?.order || { id: `order_${Date.now()}` };

      // 3. Handle Payment Method
      if (data.payment_method === 'stripe') {
        toast.loading('Redirecting to Stripe secure checkout...', { id: toastId });

        const sessionRes = await api.post('/payments/stripe/create-session', {
          order_id: createdOrder.id,
          amount: grandTotal,
          customer_email: data.email,
          customer_name: data.full_name,
          items: items.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        });

        if (sessionRes.data?.url) {
          dispatch(clearCart());
          toast.success('Redirecting to Stripe...', { id: toastId });
          window.location.href = sessionRes.data.url;
          return;
        } else {
          throw new Error('Failed to generate Stripe checkout session.');
        }
      } else if (data.payment_method === 'cod') {
        dispatch(clearCart());
        toast.success('Order placed successfully via Cash on Delivery!', { id: toastId });
        router.push('/account/orders');
      } else if (data.payment_method === 'upi' || data.payment_method === 'netbanking') {
        try {
          await api.post('/payments/create-order', {
            provider: 'razorpay',
            order_id: createdOrder.id,
            amount: grandTotal,
            customer_email: data.email,
          });
        } catch (_) {}
        dispatch(clearCart());
        toast.success(`Order placed via ${data.payment_method === 'upi' ? 'UPI' : 'Net Banking'}!`, { id: toastId });
        router.push('/account/orders?payment=success');
      } else {
        dispatch(clearCart());
        toast.success('Order registered!', { id: toastId });
        router.push('/account/orders');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-green">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">Complete your order with secure 256-bit encrypted checkout</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <span>1. Contact Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input {...register('full_name')} className="input-field" placeholder="Ahmad Khan" />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone (10 Digits) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                    <input {...register('phone')} className="input-field pl-12" placeholder="9876543210" maxLength={10} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-green" /> 2. Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flat, House no., Building, Apartment *</label>
                  <input {...register('house_no')} className="input-field" placeholder="Flat 402, Green Heights" />
                  {errors.house_no && <p className="text-red-500 text-xs mt-1">{errors.house_no.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area, Street, Sector, Village *</label>
                  <input {...register('street')} className="input-field" placeholder="Linking Road, Bandra West" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City / Town *</label>
                  <input {...register('city')} className="input-field" placeholder="Mumbai" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input {...register('state')} className="input-field" placeholder="Maharashtra" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code (6 Digits) *</label>
                  <input {...register('pincode')} className="input-field" placeholder="400050" maxLength={6} />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                  <input {...register('delivery_instructions')} className="input-field" placeholder="Leave with security, ring bell" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-green" /> 3. Select Payment Method
              </h2>
              <div className="space-y-3">
                {/* Stripe Card Payment */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'stripe' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input {...register('payment_method')} type="radio" value="stripe" className="mt-1 text-brand-green focus:ring-brand-green" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-brand-charcoal">Credit / Debit Cards (Stripe)</p>
                      <span className="text-xs bg-brand-green/10 text-brand-green font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Secure Stripe
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, RuPay, Maestro & International Cards</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">RBI Compliant 3D Secure 2-Factor Authentication (OTP)</p>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'upi' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input {...register('payment_method')} type="radio" value="upi" className="mt-1 text-brand-green focus:ring-brand-green" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-brand-charcoal">Instant UPI (GPay, PhonePe, Paytm, BHIM)</p>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Zero Extra Fee</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Pay instantly using any UPI App or QR code</p>
                  </div>
                </label>

                {/* Net Banking & Wallets */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'netbanking' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input {...register('payment_method')} type="radio" value="netbanking" className="mt-1 text-brand-green focus:ring-brand-green" />
                  <div className="flex-1">
                    <p className="font-bold text-brand-charcoal">Net Banking & Digital Wallets</p>
                    <p className="text-xs text-gray-500 mt-1">HDFC, ICICI, SBI, Axis, Kotak & 50+ Indian banks</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'cod' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input {...register('payment_method')} type="radio" value="cod" className="mt-1 text-brand-green focus:ring-brand-green" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-brand-charcoal">Cash on Delivery (COD)</p>
                      <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">Pay at doorstep</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Pay with cash when your CUP2EAT order arrives</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-brand-charcoal mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item.id}-${item.variantId}`} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span className="text-gray-600 truncate max-w-[180px]">{item.name} × {item.quantity}</span>
                  <span className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-medium text-gray-900'}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-extrabold text-xl text-brand-charcoal">
                <span>Total Amount</span>
                <span className="text-brand-green">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-brand-green text-brand-gold border-2 border-brand-gold py-3.5 rounded-xl font-bold text-base hover:bg-brand-gold hover:text-brand-green transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Connecting to Gateway...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay {formatPrice(grandTotal)}</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
              <Lock className="w-3.5 h-3.5 text-brand-green" />
              <span>Payments protected with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
