import Image from "next/image";
import Link from "next/link";
import React from "react";

interface UpcomingReleaseProps {
  status: 'comingSoon' | 'newRelease';
  backgroundTheme: 'dark' | 'light';
  titlePart1: string;
  titlePart2: string;
  text: React.ReactNode;
  imageUrl1: string;
  imageUrl2: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

const UpcomingRelease: React.FC<UpcomingReleaseProps> = ({
  status,
  backgroundTheme,
  titlePart1,
  titlePart2,
  text,
  imageUrl1,
  imageUrl2,
  imageAlt,
  buttonText,
  buttonLink,
}) => {
  // Status text mapping
  const statusText = status === 'newRelease' ? 'NEW RELEASE' : 'COMING SOON';
  
  // Theme-based styling
  const isDark = backgroundTheme === 'dark';
  const sectionClasses = isDark 
    ? "w-full py-16 md:py-24 bg-gray-900 text-white min-h-[60vh]"
    : "w-full py-16 md:py-24 bg-gray-100 text-gray-800 min-h-[60vh]";
  
  const statusClasses = isDark 
    ? "text-s uppercase tracking-widest text-gray-400 mb-4"
    : "text-s uppercase tracking-widest text-gray-500 mb-4";
    
  const title1Classes = isDark 
    ? "block heading-1 text-gray-200 mb-1"
    : "block heading-1 text-gray-700 mb-1";
    
  const title2Classes = isDark 
    ? "block heading-2 text-white"
    : "block heading-2 text-gray-800";
    
  const textClasses = isDark 
    ? "prose body-text-dark mb-6 text-lg"
    : "prose body-text-light mb-6 text-lg";
    
  const buttonClasses = isDark 
    ? "btn-primary-dark-bg"
    : "btn-primary-light-bg";

  const fallbackImageClasses = isDark 
    ? "w-full h-full bg-gray-700"
    : "w-full h-full bg-gray-300";

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center h-full">
        {/* Image Container - Uses flex to center the inner relative container */}
        <div className="w-full sm:w-2/3 lg:w-2/5 mb-20 lg:mb-0 md:mr-12 order-1 flex justify-center items-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
          {/* Inner Relative Container - Defines the aspect ratio and positioning context */}
          <div className="relative w-4/5 aspect-4/3"> {/* Adjust aspect ratio as needed */}
            {/* First Image - Positioned absolutely using percentages */}
            <div className="absolute -bottom-[3%] left-[7%] w-[65%] aspect-2/3 shadow-lg overflow-hidden z-10">
              {imageUrl1 ? (
                <Image
                  src={imageUrl1}
                  alt={imageAlt + " 1"}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className={fallbackImageClasses}></div>
              )}
            </div>
            {/* Second Image - Positioned absolutely using percentages */}
            <div className="absolute -top-[3%] right-[7%] w-[65%] aspect-2/3 shadow-lg overflow-hidden z-20">
              {imageUrl2 ? (
                <Image
                  src={imageUrl2}
                  alt={imageAlt + " 2"}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className={fallbackImageClasses}></div>
              )}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-7/8 lg:w-2/5 order-2 flex flex-col justify-center">
          {/* Status Text */}
          <div className={statusClasses}>
            {statusText}
          </div>
          
          <h2 className="mb-4">
            <span className={title1Classes}>{titlePart1}</span>
            <span className={title2Classes}>{titlePart2}</span>
          </h2>
          
          <div className={textClasses}>
            {text}
          </div>
          
          <div className="w-fit">
            <Link
              href={buttonLink || '#'}
              className={buttonClasses}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingRelease; 