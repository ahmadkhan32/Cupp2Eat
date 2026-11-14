import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white border-t border-brand-gold/30">
      {/* Value props bar */}
      <div className="bg-brand-green/80 border-b border-brand-gold/20 py-6">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Truck className="w-8 h-8 text-brand-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-cream">Pan-India Delivery</p>
              <p className="text-xs text-white/70">Free shipping on orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-cream">100% Secure Payments</p>
              <p className="text-xs text-white/70">Razorpay UPI, Cards & NetBanking</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <RefreshCw className="w-8 h-8 text-brand-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-cream">Fresh & Artisan Quality</p>
              <p className="text-xs text-white/70">FSSAI compliant recipes</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Phone className="w-8 h-8 text-brand-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-cream">WhatsApp Support</p>
              <p className="text-xs text-white/70">Direct assistance within minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-green">
                <Image
                  src="/logo/cup2eat-logo.png"
                  alt="CUP2EAT Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-brand-gold text-lg tracking-wider">CUP2EAT</p>
                <p className="text-brand-cream/70 text-xs italic">Eat Your Drink!</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Premium artisan cup foods crafted with pride in India. Revolutionary culinary convenience without compromising on taste or quality.
            </p>
            <p className="text-xs text-brand-gold font-medium">FSSAI Lic. No: 10022000000001</p>
          </div>

          <div>
            <h3 className="font-bold text-brand-gold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-brand-gold transition-colors">Home Store</Link></li>
              <li><Link href="/products" className="hover:text-brand-gold transition-colors">All Products</Link></li>
              <li><Link href="/categories/cup-noodles" className="hover:text-brand-gold transition-colors">Cup Noodles</Link></li>
              <li><Link href="/categories/cup-soups" className="hover:text-brand-gold transition-colors">Artisan Soups</Link></li>
              <li><Link href="/categories/cup-desserts" className="hover:text-brand-gold transition-colors">Cup Desserts</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">Our Story & Ingredients</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-brand-gold mb-4 uppercase tracking-wider text-sm">Customer Care</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/login" className="hover:text-brand-gold transition-colors">Customer Login / Register</Link></li>
              <li><Link href="/account/orders" className="hover:text-brand-gold transition-colors">Order Tracking</Link></li>
              <li><Link href="/account/addresses" className="hover:text-brand-gold transition-colors">Saved Addresses</Link></li>
              <li><Link href="/cart" className="hover:text-brand-gold transition-colors">My Cart</Link></li>
              <li><Link href="/admin/login" className="hover:text-brand-gold text-xs opacity-75">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-brand-gold mb-4 uppercase tracking-wider text-sm">Reach Us</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span>CUP2EAT Corporate Office, Connaught Place, New Delhi - 110001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">
                  +91 99999 99999 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href="mailto:support@cup2eat.com" className="hover:text-brand-gold">
                  support@cup2eat.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs text-center md:text-left">
            © {new Date().getFullYear()} CUP2EAT Pvt. Ltd. All rights reserved. Prices inclusive of all applicable GST.
          </p>
          <p className="text-white/50 text-xs flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in India • Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
