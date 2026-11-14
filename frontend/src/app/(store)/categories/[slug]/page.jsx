import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

const CATEGORY_PRODUCTS = {
  'cup-noodles': {
    name: 'Cup Noodles',
    description: 'Premium artisan cup noodles in exotic flavours',
    products: [
      { id: '1', name: 'Masala Maggi Cup', slug: 'masala-maggi-cup', price: 149, rating: 4.8, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
      { id: '2', name: 'Schezwan Noodle Cup', slug: 'schezwan-noodle-cup', price: 169, rating: 4.7, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400' },
      { id: '5', name: 'Pav Bhaji Cup', slug: 'pav-bhaji-cup', price: 179, rating: 4.5, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
    ],
  },
};

export default function CategoryPage({ params }) {
  const { slug } = params;
  const category = CATEGORY_PRODUCTS[slug] || {
    name: slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    description: 'Premium cup products',
    products: [],
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand-green mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {category.products.map(product => (
            <Link key={product.id} href={`/products/${product.slug}`} className="card group">
              <div className="h-48 overflow-hidden">
                <img src={product.image} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-charcoal mb-2 group-hover:text-brand-green">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <span className="text-xl font-bold text-brand-green">₹{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 mb-4">No products in this category yet</p>
          <Link href="/products" className="btn-primary">Browse All Products</Link>
        </div>
      )}
    </div>
  );
}
