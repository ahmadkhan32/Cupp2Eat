import Image from 'next/image';
import { Award, Leaf, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-brand-cream">
      {/* Hero */}
      <section className="bg-brand-green py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-green shadow-xl">
            <Image src="/logo/cup2eat-logo.png" alt="CUP2EAT Emblem" fill sizes="96px" className="object-cover" priority />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-2">Our Story</h1>
          <p className="text-xl text-brand-gold font-bold italic mb-4">CUP2EAT – Eat Your Drink!</p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Born from a passion for authentic Indian flavours and the need for convenient, premium food — CUP2EAT is redefining what it means to Eat Your Drink!
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-brand-green mb-6">Why CUP2EAT?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We started CUP2EAT with a simple vision: bring the rich, diverse flavours of India into a convenient cup format without compromising on quality or taste.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Every product we craft uses premium, natural ingredients sourced from across India — from the spice markets of Kerala to the saffron fields of Kashmir.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are FSSAI certified and committed to zero artificial preservatives, zero MSG, and 100% authentic flavour.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Award, title: 'FSSAI Certified', desc: 'All products meet highest food safety standards' },
              { icon: Leaf, title: 'Natural Ingredients', desc: 'No artificial colours, flavours or preservatives' },
              { icon: Heart, title: 'Made with Love', desc: 'Crafted with passion for authentic Indian taste' },
              { icon: Users, title: '10,000+ Happy Customers', desc: 'Trusted by food lovers across India' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <Icon className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                <h3 className="font-bold text-brand-green mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🌿', title: 'Sustainability', desc: 'Eco-friendly packaging and responsible sourcing' },
              { emoji: '✨', title: 'Quality First', desc: 'Never compromise on ingredients or taste' },
              { emoji: '🤝', title: 'Community', desc: 'Supporting local farmers and artisans' },
            ].map(v => (
              <div key={v.title} className="text-white">
                <div className="text-5xl mb-4">{v.emoji}</div>
                <h3 className="text-xl font-bold text-brand-gold mb-3">{v.title}</h3>
                <p className="text-gray-300">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
