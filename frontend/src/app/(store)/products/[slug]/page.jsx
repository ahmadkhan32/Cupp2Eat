'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import toast from 'react-hot-toast';

const PRODUCT_DATA = {
  'masala-maggi-cup': {
    id: '1', name: 'Masala Maggi Cup', price: 149, rating: 4.8, reviews: 234,
    description: 'Experience the authentic taste of Mumbai street food in a convenient cup. Our Masala Maggi Cup is crafted with premium wheat noodles and a rich masala broth made from 12 hand-selected spices.',
    category: 'Cup Noodles',
    images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600'],
    variants: [{ id: 'v1', name: 'Original Masala', price: 149 }, { id: 'v2', name: 'Extra Spicy', price: 149 }, { id: 'v3', name: 'Mild', price: 149 }],
    weight: '75g', servings: 1, prep_time: '3 minutes',
  }
};

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const product = PRODUCT_DATA[slug] || {
    id: slug, name: slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    price: 149, rating: 4.7, reviews: 120, description: 'Premium quality cup food product by CUP2EAT.',
    category: 'Cup Noodles', images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600'],
    variants: [{ id: 'v1', name: 'Original', price: 149 }], weight: '75g', servings: 1, prep_time: '3 minutes',
  };

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id, name: product.name, price: selectedVariant.price,
      image: product.images[0], variantId: selectedVariant.id,
      variantName: selectedVariant.name, quantity,
    }));
    toast.success('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/products" className="flex items-center gap-2 text-brand-green hover:text-brand-gold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden h-96 mb-4">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-medium text-brand-gold bg-brand-green px-3 py-1 rounded-full">{product.category}</span>
          <h1 className="text-4xl font-bold text-brand-charcoal mt-4 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-brand-gold text-brand-gold' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="text-4xl font-bold text-brand-green mb-6">₹{selectedVariant.price}</div>

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {/* Variants */}
          <div className="mb-6">
            <h3 className="font-semibold text-brand-charcoal mb-3">Select Flavour</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button key={v.id} onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    selectedVariant.id === v.id ? 'bg-brand-green text-brand-gold border-brand-gold' : 'border-gray-300 hover:border-brand-green'
                  }`}>
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border-2 border-brand-green rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-brand-green font-bold hover:bg-brand-green hover:text-white transition-colors">−</button>
              <span className="px-4 py-2 font-semibold text-brand-charcoal">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-brand-green font-bold hover:bg-brand-green hover:text-white transition-colors">+</button>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 flex-1 justify-center">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="border-2 border-brand-green text-brand-green p-3 rounded-lg hover:bg-brand-green hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-white rounded-xl">
            <div className="text-center"><span className="text-2xl">⚡</span><p className="text-xs text-gray-600 mt-1">Ready in {product.prep_time}</p></div>
            <div className="text-center"><span className="text-2xl">🌿</span><p className="text-xs text-gray-600 mt-1">Natural ingredients</p></div>
            <div className="text-center"><span className="text-2xl">📦</span><p className="text-xs text-gray-600 mt-1">{product.weight} per cup</p></div>
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-green" /> Free delivery on ₹499+</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-green" /> FSSAI Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
