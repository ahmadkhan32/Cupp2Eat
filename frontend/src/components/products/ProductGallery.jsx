'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [] }) {
  const defaultImages = images.length > 0 ? images : [{ image_url: '/logo/cup2eat-logo.png' }];
  const [selectedImage, setSelectedImage] = useState(defaultImages[0]?.image_url || '/logo/cup2eat-logo.png');

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 sm:h-[450px] w-full rounded-2xl overflow-hidden bg-brand-green/5 border border-brand-gold/30 shadow-md">
        <Image
          src={selectedImage}
          alt="Product display"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {defaultImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {defaultImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img.image_url)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedImage === img.image_url
                  ? 'border-brand-gold ring-2 ring-brand-gold/50 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
