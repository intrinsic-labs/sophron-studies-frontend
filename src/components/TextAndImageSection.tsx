import React from 'react';
import Image from 'next/image';

interface TextAndImageSectionProps {
  title: string;
  text: React.ReactNode; // Allow for paragraphs or more complex text
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right'; // Default to right if not specified
}

const TextAndImageSection: React.FC<TextAndImageSectionProps> = ({
  title,
  text,
  imageUrl,
  imageAlt,
  imagePosition = 'right',
}) => {
  const imageComponent = (
    <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
      {/* Use next/image for optimization */}
      <Image 
        src={imageUrl} 
        alt={imageAlt} 
        width={400} // Adjust placeholder size as needed
        height={400} 
        className="object-cover rounded-md shadow-lg max-w-full h-auto"
      />
    </div>
  );

  const textComponent = (
    <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
      {/* Use heading2 font */}
      <h2 className="text-4xl md:text-5xl font-heading2 mb-6">
        {title}
      </h2>
      {/* Use body serif font */}
      <div className="text-lg font-serif text-gray-700 space-y-4">
        {text}
      </div>
    </div>
  );

  return (
    <section className="container mx-auto py-16 px-4">
      <div className={`flex flex-wrap items-center ${imagePosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {imageComponent}
        {textComponent}
      </div>
    </section>
  );
};

export default TextAndImageSection; 