import Link from 'next/link';
import { User, MapPin, ShoppingBag, Settings } from 'lucide-react';

export default function AccountDashboard() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-green mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { href: '/account/profile', icon: User, title: 'Profile', desc: 'Manage your personal info' },
          { href: '/account/orders', icon: ShoppingBag, title: 'Orders', desc: 'Track & manage orders' },
          { href: '/account/addresses', icon: MapPin, title: 'Addresses', desc: 'Saved delivery addresses' },
          { href: '/account/settings', icon: Settings, title: 'Settings', desc: 'Account preferences' },
        ].map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} href={href} className="card p-6 text-center group hover:border-brand-gold border-2 border-transparent">
            <Icon className="w-12 h-12 text-brand-green mx-auto mb-4 group-hover:text-brand-gold transition-colors" />
            <h3 className="font-bold text-brand-charcoal text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
