'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Masala Maggi Cup', slug: 'masala-maggi-cup', price: 149, rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', category: 'Cup Noodles' },
  { id: '2', name: 'Schezwan Noodle Cup', slug: 'schezwan-noodle-cup', price: 169, rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400', category: 'Cup Noodles' },
  { id: '3', name: 'Tomato Basil Soup Cup', slug: 'tomato-basil-soup-cup', price: 129, rating: 4.9, reviews: 312, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', category: 'Cup Soups' },
  { id: '4', name: 'Mango Rabri Cup', slug: 'mango-rabri-cup', price: 199, rating: 4.6, reviews: 156, image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400', category: 'Cup Desserts' },
  { id: '5', name: 'Pav Bhaji Cup', slug: 'pav-bhaji-cup', price: 179, rating: 4.5, reviews: 98, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', category: 'Cup Noodles' },
  { id: '6', name: 'Corn Chowder Cup', slug: 'corn-chowder-cup', price: 139, rating: 4.8, reviews: 201, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', category: 'Cup Soups' },
  { id: '7', name: 'Gulab Jamun Cup', slug: 'gulab-jamun-cup', price: 219, rating: 4.9, reviews: 445, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Cup Desserts' },
  { id: '8', name: 'Masala Chai Cup', slug: 'masala-chai-cup', price: 89, rating: 4.7, reviews: 567, image: 'https://images.unsplash.com/photo-1565600444102-3a3e5b32d5e9?w=400', category: 'Beverages' },
];

const CATEGORIES = ['All', 'Cup Noodles', 'Cup Soups', 'Cup Desserts', 'Beverages'];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const dispatch = useDispatch();

  const filtered = MOCK_PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, variantId: null }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-green mb-2">All Products</h1>
      <p className="text-gray-600 mb-8">Explore our complete cup collection</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field md:w-48">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
              category === cat ? 'bg-brand-green text-brand-gold border-brand-gold' : 'border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="card group">
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-48 overflow-hidden">
                <img src={product.image} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 bg-brand-gold text-brand-green text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-brand-charcoal mb-1 hover:text-brand-green transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand-green">₹{product.price}</span>
                <button onClick={() => handleAddToCart(product)}
                  className="bg-brand-green text-white p-2 rounded-lg hover:bg-brand-gold hover:text-brand-green transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400">No products found</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary mt-4">Clear Filters</button>
        </div>
      )}
    </div>
  );
}
