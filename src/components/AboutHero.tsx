import React from 'react';
import Image from 'next/image';

interface AboutHeroProps {
  name: string;
  backgroundImage?: string;
  rightImage?: string;
  leftImage?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ name, backgroundImage, rightImage, leftImage }) => {
  return (
    <section className="relative flex flex-col space-y-8 items-center justify-center mt-8 bg-white overflow-hidden px-2 mb-12">
      {/* Relative container for images */}
      <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] mb-12">
        {/* Background Image */}
        {backgroundImage ? (
          <div className="absolute top-[5%] left-[10%] w-[80%] aspect-[6/5] z-0 overflow-hidden shadow-lg transform -rotate-3">
            <Image 
              src={backgroundImage} 
              alt="Background" 
              fill 
              style={{objectFit:'cover'}} 
              priority
              sizes="(max-width: 768px) 80vw, 40vw"
            />
          </div>
        ) : (
          <div className="absolute top-[5%] left-[10%] w-[80%] aspect-[6/5] bg-gray-300 z-0 shadow-lg transform -rotate-3" />
        )}
        {/* Right Image */}
        {rightImage ? (
          <div className="absolute top-[15%] right-[5%] w-[55%] aspect-[4/5] z-10 overflow-hidden shadow-lg transform rotate-2">
            <Image 
              src={rightImage} 
              alt="Right" 
              fill 
              style={{objectFit:'cover'}} 
              priority
              sizes="(max-width: 768px) 55vw, 25vw"
            />
          </div>
        ) : (
          <div className="absolute top-[15%] right-[5%] w-[55%] aspect-[4/5] bg-gray-400 z-10 shadow-lg transform rotate-2" />
        )}
        {/* Left Image */}
        {leftImage ? (
          <div className="absolute bottom-[8%] left-[2%] w-[45%] aspect-[1/1] z-10 overflow-hidden shadow-md transform -rotate-6">
            <Image 
              src={leftImage} 
              alt="Left" 
              fill 
              style={{objectFit:'cover'}} 
              priority
              sizes="(max-width: 768px) 45vw, 20vw"
            />
          </div>
        ) : (
          <div className="absolute bottom-[8%] left-[2%] w-[45%] aspect-[1/1] bg-gray-200 z-10 shadow-md transform -rotate-6" />
        )}
      </div>
      {/* Name in script font - positioned relative to the section, overlapping images */}
      <h1 className="relative z-20 text-5xl md:text-7xl font-heading1 text-center">
        {name}
      </h1>
    </section>
  );
};

export default AboutHero; 