'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const activePrice = product.sale_price || product.base_price || product.price;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: activePrice,
        variantId: product.variantId || product.product_variants?.[0]?.id || null,
        image: product.image || product.product_images?.[0]?.image_url || '/logo/cup2eat-logo.png',
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const currentPrice = product.sale_price || product.base_price || product.price;
  const originalPrice = product.sale_price ? product.base_price || product.price : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const primaryImage = product.image || product.product_images?.find(i => i.is_primary)?.image_url || product.product_images?.[0]?.image_url || '/logo/cup2eat-logo.png';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group">
      {/* Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative block h-56 bg-brand-green/5 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            {discountPercent}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-brand-gold text-brand-green text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
            BESTSELLER
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider">
            {product.category?.name || product.category || 'Artisan Cup'}
          </span>
          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="font-bold text-brand-charcoal text-base group-hover:text-brand-green transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {product.description || 'Authentic taste ready in 3 minutes. Perfect blend of spices and crunch.'}
          </p>
        </div>

        {/* Rating & Price */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
              <span className="text-xs font-bold text-brand-charcoal">
                {product.rating || '4.8'}
              </span>
              <span className="text-[10px] text-gray-400">({product.reviews_count || 24})</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-brand-green">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-brand-green text-brand-gold hover:bg-brand-gold hover:text-brand-green transition-all shadow-sm group-hover:scale-105"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
