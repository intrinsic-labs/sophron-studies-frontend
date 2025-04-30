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
    <section className="py-16 bg-olive mb-16 lg:mb-24">
      <div className="relative w-full max-w-6xl mx-auto flex gap-4 items-center px-4">
        {images && images.length > 0 ? (
          images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className={`shadow-lg relative ${i % 2 === 0 ? '-mb-8' : i % 3 === 0 ? '-mb-6' : '-mb-4'}`}
              style={{ 
                width: 240 + (i % 3) * 16, 
                height: 240 + (i % 2) * 64,
                background: !img.url ? '#d3d3b8' : undefined 
              }}
            >
              {img.url ? (
                <Image 
                  src={img.url} 
                  alt={img.alt || `Gallery image ${i+1}`} 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 50vw, 240px"
                />
              ) : (
                <div className="w-full h-full bg-olive-light"></div>
              )}
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