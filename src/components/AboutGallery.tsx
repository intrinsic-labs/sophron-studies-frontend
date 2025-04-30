import React from 'react';
import Image from 'next/image';

interface GalleryImage {
  url?: string;
  alt?: string;
}

interface AboutGalleryProps {
  images: GalleryImage[];
}

const AboutGallery: React.FC<AboutGalleryProps> = ({ images }) => {
  return (
    <section className="py-16 bg-olive">
      <div className="relative w-full max-w-6xl mx-auto flex gap-4 items-center px-4">
        {images && images.length > 0 ? (
          images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className={`shadow-lg ${i % 2 === 0 ? '-mb-8' : i % 3 === 0 ? '-mb-6' : '-mb-4'}`}
              style={{ width: 240 + (i % 3) * 16, height: 240 + (i % 2) * 64, background: !img.url ? 'olive' : undefined }}
            >
              {img.url ? (
                <Image src={img.url} alt={img.alt || ''} width={300} height={300} className="object-cover w-full h-full" />
              ) : null}
            </div>
          ))
        ) : (
          // Fallback: 5 gray boxes
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-64 h-64 bg-gray-200 shadow-lg -mb-8" />
          ))
        )}
      </div>
    </section>
  );
};

export default AboutGallery; 