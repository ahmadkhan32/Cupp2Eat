'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="bg-brand-cream">
      <section className="bg-brand-green py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-300 text-xl">We&apos;d love to hear from you!</p>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-green">Get in Touch</h2>
            {[
              { icon: Mail, label: 'Email', value: 'hello@cup2eat.in', href: 'mailto:hello@cup2eat.in' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India', href: '#' },
              { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/919876543210' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-brand-green p-3 rounded-lg">
                  <Icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="font-semibold text-brand-charcoal">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 card p-8">
            <h2 className="text-2xl font-bold text-brand-green mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required className="input-field" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  required className="input-field" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required rows={5} className="input-field resize-none" placeholder="Your message..." />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Send className="w-5 h-5" /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
