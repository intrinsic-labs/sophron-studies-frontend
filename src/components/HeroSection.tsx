import React from 'react';

interface HeroSectionProps {
  title: string;
  // Add props for background video/image later
}

const HeroSection: React.FC<HeroSectionProps> = ({ title }) => {
  return (
    <section className="w-full min-h-[65vh] flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Placeholder for background video/image */} 
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div> {/* Optional overlay */} 
      
      <div className="relative z-10 text-center p-8 max-w-4xl mx-auto">
        {/* Use heading-hero class */}
        <h1 className="heading-hero text-gray-800">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection; 