import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/store/ReduxProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata = {
  title: 'CUP2EAT – Eat Your Drink!',
  description: "Premium artisan food and beverage brand. India's finest cup-based snacks.",
  keywords: 'cup2eat, food, beverages, snacks, India, premium',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </ReduxProvider>
      </body>
    </html>
  );
}
