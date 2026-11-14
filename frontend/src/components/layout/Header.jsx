'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, LogOut, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { setUser } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function Header() {
  const { itemCount } = useSelector((s) => s.cart);
  const { isAuthenticated, user, role } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    dispatch(setUser(null));
    toast.success('Signed out successfully');
    router.push('/');
    setUserMenuOpen(false);
  };

  const isAdmin = ['super_admin', 'org_admin', 'admin'].includes(role);

  return (
    <header className="bg-brand-green shadow-lg sticky top-0 z-40 border-b border-brand-gold/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold shadow-md group-hover:scale-105 transition-transform duration-300 bg-brand-green">
              <Image
                src="/logo/cup2eat-logo.png"
                alt="CUP2EAT Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-extrabold text-brand-gold text-xl tracking-wider leading-none">CUP2EAT</p>
              <p className="text-brand-cream/80 text-xs italic tracking-wide font-medium mt-1">Eat Your Drink!</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              Products
            </Link>
            <Link href="/categories/cup-noodles" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              Noodles
            </Link>
            <Link href="/categories/cup-desserts" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              Desserts
            </Link>
            <Link href="/about" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-brand-cream hover:text-brand-gold font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/products" className="p-2 text-brand-cream hover:text-brand-gold transition-colors" title="Search">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative p-2 text-brand-cream hover:text-brand-gold transition-colors" title="Cart">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-green text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 text-brand-cream hover:text-brand-gold transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center shadow">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-brand-charcoal text-sm truncate">{user?.full_name || 'My Account'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {role && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded">
                          {role.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-green font-semibold hover:bg-brand-cream"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-gold" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" /> Account Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingCart className="w-4 h-4" /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 bg-brand-gold text-brand-green font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm shadow"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-brand-cream hover:text-brand-gold"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-green border-t border-brand-gold/20 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium border-b border-white/5"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium border-b border-white/5"
          >
            Products
          </Link>
          <Link
            href="/categories/cup-noodles"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium border-b border-white/5"
          >
            Noodles & Soups
          </Link>
          <Link
            href="/categories/cup-desserts"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium border-b border-white/5"
          >
            Desserts & Drinks
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium border-b border-white/5"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-brand-cream hover:text-brand-gold font-medium"
          >
            Contact Support
          </Link>

          {!isAuthenticated ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-brand-gold text-brand-green font-bold py-2.5 rounded-lg"
              >
                Sign In with Email / Google
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center border border-brand-gold text-brand-gold py-2 rounded-lg text-sm"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/10">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-brand-gold font-bold"
                >
                  Admin Dashboard →
                </Link>
              )}
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-brand-cream"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
