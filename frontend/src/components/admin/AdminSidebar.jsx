'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  CreditCard,
  FileText,
  Tag,
  Star,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  ChevronRight,
  Store,
  ShieldAlert
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { setUser } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const [currentRole, setCurrentRole] = useState(role || 'super_admin');

  useEffect(() => {
    if (role) setCurrentRole(role);
  }, [role]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    dispatch(setUser(null));
    toast.success('Logged out from Admin portal');
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Products (CRUD)',
      href: '/admin/products',
      icon: Package,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: Layers,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      icon: Warehouse,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: Users,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      roles: ['super_admin', 'org_admin'],
    },
    {
      label: 'Invoices (PDF)',
      href: '/admin/invoices',
      icon: FileText,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Coupons',
      href: '/admin/coupons',
      icon: Tag,
      roles: ['super_admin', 'org_admin'],
    },
    {
      label: 'Reviews',
      href: '/admin/reviews',
      icon: Star,
      roles: ['super_admin', 'org_admin', 'admin'],
    },
    {
      label: 'Reports & Analytics',
      href: '/admin/reports',
      icon: BarChart3,
      roles: ['super_admin', 'org_admin'],
    },
    {
      label: 'Role & Admin Mgmt',
      href: '/admin/users',
      icon: UserCheck,
      roles: ['super_admin', 'org_admin'],
      highlight: true,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['super_admin'],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <aside className="w-64 bg-brand-charcoal text-white flex flex-col border-r border-brand-gold/30 shadow-xl shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-gold bg-brand-green shrink-0">
          <Image
            src="/logo/cup2eat-logo.png"
            alt="CUP2EAT"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h2 className="font-extrabold text-brand-gold text-lg tracking-wider leading-none truncate">
            CUP2EAT
          </h2>
          <p className="text-[11px] text-white/70 tracking-tight uppercase font-semibold mt-1">
            Admin Suite
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 bg-brand-green/30 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/50 uppercase font-semibold">Active Role</p>
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            {currentRole.replace('_', ' ')}
          </span>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-green text-brand-gold font-bold shadow border border-brand-gold/40'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-white/60 group-hover:text-brand-gold'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-brand-gold hover:bg-white/5 transition-colors"
        >
          <Store className="w-4 h-4" /> Return to Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
