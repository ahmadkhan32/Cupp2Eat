'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowRight, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Masala Magic Cup Noodles', slug: 'masala-magic-cup-noodles', price: 149, salePrice: 119, rating: 4.8, image: null, category: 'Cup Noodles', variantId: 'v1' },
  { id: '2', name: 'Tomato Twist Soup', slug: 'tomato-twist-soup', price: 99, salePrice: 79, rating: 4.6, image: null, category: 'Cup Soups', variantId: 'v2' },
  { id: '3', name: 'Belgian Chocolate Bliss', slug: 'belgian-chocolate-bliss', price: 199, salePrice: 169, rating: 4.9, image: null, category: 'Cup Desserts', variantId: 'v3' },
  { id: '4', name: 'Green Matcha Latte', slug: 'green-matcha-latte', price: 129, salePrice: 99, rating: 4.7, image: null, category: 'Beverages', variantId: 'v4' },
];

const CATEGORIES = [
  { name: 'Cup Noodles', slug: 'cup-noodles', emoji: '🍜', count: 12 },
  { name: 'Cup Soups', slug: 'cup-soups', emoji: '🍲', count: 8 },
  { name: 'Cup Desserts', slug: 'cup-desserts', emoji: '🍮', count: 10 },
  { name: 'Beverages', slug: 'beverages', emoji: '☕', count: 15 },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'CUP2EAT has completely changed my snack game! The masala noodles are absolutely divine. Fast delivery too!' },
  { name: 'Rahul Verma', city: 'Delhi', rating: 5, text: 'Premium quality at an affordable price. The chocolate cup dessert is my go-to after a long day at work.' },
  { name: 'Anjali Patel', city: 'Bangalore', rating: 4, text: 'Love the variety of flavours. The matcha latte is perfect for my morning routine. Highly recommended!' },
];

export default function HomePage() {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.salePrice || product.price, variantId: product.variantId, image: product.image }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-green min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-brand-gold blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold px-4 py-2 rounded-full mb-6">
                <span className="text-brand-gold text-sm font-semibold">🏆 India&apos;s #1 Premium Cup Foods</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 tracking-wide">
                <span className="text-brand-gold">CUP2EAT</span>
              </h1>
              <p className="text-3xl md:text-4xl font-bold text-brand-gold/90 mb-6 italic">Eat Your Drink!</p>
              <p className="text-lg text-brand-cream/80 mb-10 max-w-xl leading-relaxed">
                Premium artisan cup foods crafted with the finest ingredients. From rich spicy noodles to warm molten lava desserts — experience gourmet flavour in every sip and bite.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 bg-brand-gold text-brand-green font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all duration-300 text-lg shadow-lg hover:shadow-brand-gold/40">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 border-2 border-brand-gold text-brand-gold font-semibold px-8 py-4 rounded-xl hover:bg-brand-gold hover:text-brand-green transition-all duration-300 text-lg">
                  Our Story
                </Link>
              </div>
              <div className="flex flex-wrap gap-8 mt-12 text-white/80">
                <div className="text-center"><p className="text-3xl font-bold text-brand-gold">45+</p><p className="text-sm">Flavours</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-brand-gold">10K+</p><p className="text-sm">Happy Customers</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-brand-gold">4.8★</p><p className="text-sm">Average Rating</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-brand-gold">Pan-India</p><p className="text-sm">Delivery</p></div>
              </div>
            </div>

            {/* Hero Emblem Banner Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-2 bg-gradient-to-tr from-brand-gold via-yellow-200 to-brand-gold shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-pulse">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-brand-gold bg-brand-green shadow-inner">
                  <Image
                    src="/logo/cup2eat-logo.png"
                    alt="CUP2EAT Emblem"
                    fill
                    sizes="(max-width: 768px) 280px, 384px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-charcoal mb-3">Explore Categories</h2>
            <p className="text-gray-600 text-lg">Find your perfect cup food experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-brand-gold">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
                <h3 className="font-bold text-brand-charcoal text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-brand-charcoal mb-2">Best Sellers</h2>
              <p className="text-gray-600">Our most loved cup food creations</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all duration-300">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="bg-brand-cream rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="bg-brand-green/10 h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl">{product.category === 'Cup Noodles' ? '🍜' : product.category === 'Cup Soups' ? '🍲' : product.category === 'Cup Desserts' ? '🍮' : '☕'}</div>
                  {product.salePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-brand-green font-medium uppercase tracking-wide">{product.category}</span>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-brand-charcoal mt-1 mb-2 group-hover:text-brand-green transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-brand-green">{formatPrice(product.salePrice || product.price)}</span>
                      {product.salePrice && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>}
                    </div>
                    <button onClick={() => handleAddToCart(product)}
                      className="p-2 bg-brand-green text-white rounded-lg hover:bg-brand-gold hover:text-brand-green transition-all duration-300">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Ready to Eat Your Drink?</h2>
          <p className="text-brand-green/80 text-lg mb-8 max-w-xl mx-auto">Free shipping on orders above ₹499. Delivered pan-India within 3–5 business days.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-brand-green text-brand-gold border-2 border-brand-green font-bold px-10 py-4 rounded-xl hover:bg-transparent hover:text-brand-green transition-all duration-300 text-lg">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-charcoal mb-3">What Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-brand-charcoal">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
