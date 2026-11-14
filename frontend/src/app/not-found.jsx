import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream">
      <h1 className="text-8xl font-bold text-brand-green">404</h1>
      <p className="text-2xl text-brand-charcoal mt-4 mb-8">Page not found</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );
}
