'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '919999999999';
  const text = encodeURIComponent('Hi CUP2EAT team! I would like to know more about your artisan cup foods.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

  return (
    <aside aria-label="Customer support" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with CUP2EAT on WhatsApp"
        className="group flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-500/40"
      >
        <MessageCircle className="w-6 h-6 fill-white text-transparent" />
        <span className="hidden sm:inline font-semibold text-sm tracking-wide">
          Need Help? Chat with us
        </span>
      </a>
    </aside>
  );
}
