'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '@/features/cart/cartSlice';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, total, itemCount } = useSelector(s => s.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-brand-charcoal mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some delicious cup foods to get started!</p>
        <Link href="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-green mb-8">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.id}-${item.variantId}`} className="card p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-semibold text-brand-charcoal">{item.name}</h3>
                {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                <p className="text-brand-green font-bold text-lg mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => { dispatch(removeFromCart({ id: item.id, variantId: item.variantId })); toast.success('Removed from cart'); }}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center border-2 border-brand-green rounded-lg">
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, variantId: item.variantId, quantity: Math.max(1, item.quantity - 1) }))}
                    className="px-3 py-1 text-brand-green font-bold hover:bg-brand-green hover:text-white transition-colors">−</button>
                  <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, variantId: item.variantId, quantity: item.quantity + 1 }))}
                    className="px-3 py-1 text-brand-green font-bold hover:bg-brand-green hover:text-white transition-colors">+</button>
                </div>
                <p className="font-bold text-brand-charcoal">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <button onClick={() => dispatch(clearCart())} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold text-brand-charcoal mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={total >= 499 ? 'text-green-600 font-semibold' : ''}>{total >= 499 ? 'FREE' : formatPrice(60)}</span>
            </div>
            {total < 499 && (
              <p className="text-sm text-brand-gold bg-brand-green/10 p-2 rounded-lg">
                Add {formatPrice(499 - total)} more for free delivery!
              </p>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-xl text-brand-charcoal">
              <span>Total</span>
              <span className="text-brand-green">{formatPrice(total < 499 ? total + 60 : total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/products" className="btn-secondary w-full text-center mt-3 block">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
