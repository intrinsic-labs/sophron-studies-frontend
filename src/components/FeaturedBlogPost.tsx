import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeaturedBlogPostProps {
  titlePart1: string;
  titlePart2: string;
  text: React.ReactNode;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({
  titlePart1,
  titlePart2,
  text,
  imageUrl1,
  imageUrl2,
  imageUrl3,
  imageAlt,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="py-16 md:py-24 bg-background text-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center bg-[var(--olive)]">
        {/* Text Content */}
        <div className="w-full md:w-1/3 md:pr-12 mb-8 md:mb-0 order-2 md:order-1">
          <h2 className="mb-4">
            <span className="block heading-1 text-gray-700 mb-1">{titlePart1}</span>
            <span className="block heading-2 text-gray-800">{titlePart2}</span>
          </h2>
          <div className="prose body-text text-gray-600 mb-6">
            {text}
          </div>
          <Link 
            href={buttonLink || '#'} 
            className="btn-primary"
          >
            {buttonText}
          </Link>
        </div>

        {/* Overlapping Images - 3 images, responsive, like UpcomingRelease */}
        <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center items-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
          <div className="relative w-4/5 aspect-[4/3] flex items-center justify-center">
            {/* Large Left Image */}
            <div className="absolute -top-[5%] left-0 w-[60%] aspect-[4/5] shadow-lg overflow-hidden z-10 rotate-[-6deg] flex items-center justify-center">
              {imageUrl1 ? (
                <Image
                  src={imageUrl1}
                  alt={imageAlt + ' 1'}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 60vw, 30vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
            {/* Medium Right Image */}
            <div className="absolute top-[10%] right-0 w-[55%] aspect-[4/5] shadow-lg overflow-hidden z-20 rotate-[4deg] flex items-center justify-center">
              {imageUrl2 ? (
                <Image
                  src={imageUrl2}
                  alt={imageAlt + ' 2'}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 55vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            {/* Small Center/Bottom Image */}
            <div className="absolute bottom-[-8%] left-1/2 -translate-x-1/2 w-[38%] aspect-[1/1] shadow-md overflow-hidden z-30 rotate-[-2deg] flex items-center justify-center">
              {imageUrl3 ? (
                <Image
                  src={imageUrl3}
                  alt={imageAlt + ' 3'}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 38vw, 19vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-400"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPost; 