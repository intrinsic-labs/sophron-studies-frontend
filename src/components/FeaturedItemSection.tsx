import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedItemSectionProps {
  title: string;
  text: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string; // Optional background color class (e.g., 'bg-gray-900')
  textColor?: string; // Optional text color class (e.g., 'text-white')
}

const FeaturedItemSection: React.FC<FeaturedItemSectionProps> = ({
  title,
  text,
  imageUrl,
  imageAlt,
  buttonText,
  buttonLink,
  imagePosition = 'right',
  backgroundColor = 'bg-white', // Default background
  textColor = 'text-gray-800', // Default text color
}) => {
  const imageComponent = (
    <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
      <Image 
        src={imageUrl} 
        alt={imageAlt} 
        width={400} 
        height={400} 
        className="object-cover rounded-md shadow-lg max-w-full h-auto"
      />
    </div>
  );

  const textComponent = (
    <div className={`w-full md:w-1/2 p-4 flex flex-col justify-center ${textColor}`}>
      <h2 className="text-4xl md:text-5xl font-heading2 mb-6">
        {title}
      </h2>
      <div className="text-lg font-serif mb-8 space-y-4">
        {text}
      </div>
      <div className="mt-auto"> {/* Pushes button to bottom */} 
        <Link 
          href={buttonLink} 
          className={`inline-block px-6 py-3 border ${textColor === 'text-white' ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'} transition-colors`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );

  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-wrap items-center ${imagePosition === 'left' ? 'flex-row-reverse' : ''}`}>
          {imageComponent}
          {textComponent}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItemSection;