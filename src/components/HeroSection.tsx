import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  vimeoUrl?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  overlayOpacity?: number; // 0-1, defaults to 0.3
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  vimeoUrl, 
  backgroundImage, 
  overlayOpacity = 0.3 
}) => {
  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = vimeoUrl ? getVimeoId(vimeoUrl) : null;

  return (
    <section className="w-full min-h-[35vh] md:min-h-[50vh] lg:min-h-[65vh] flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Background Video or Image */}
      {vimeoId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&controls=0&background=1`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; fullscreen"
            style={{
              pointerEvents: 'none',
              width: 'max(100%, calc(100vh * 16/9))',
              height: 'max(100%, calc(100vw * 9/16))',
              minWidth: '100%',
              minHeight: '100%',
            }}
          />
        </div>
      ) : backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />
      
      <div className="relative z-20 text-center p-8 max-w-4xl mx-auto flex flex-col items-center">
        {/* Logo - full size, max-w-4xl */}
        <div className="w-full max-w-4xl mb-8">
          <Image
            src="/images/logo-white.svg"
            alt="Sophron Studies Logo"
            width={1600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
        {/* Use heading-hero class */}
        {/* <h1 className="heading-hero text-gray-800">
          {title}
        </h1> */}
      </div>
    </section>
  );
};

export default HeroSection; 