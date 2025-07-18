import Image from "next/image";
import Link from "next/link";
import React from "react";

interface UpcomingReleaseProps {
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
  titlePart1,
  titlePart2,
  text,
  imageUrl1,
  imageUrl2,
  imageAlt,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-900 text-white min-h-[60vh]">
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
                <div className="w-full h-full bg-gray-700"></div>
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
                <div className="w-full h-full bg-gray-800"></div>
              )}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-7/8 lg:w-2/5 order-2 flex flex-col justify-center">
          <h2 className="mb-4">
            {/* Apply heading-1 and heading-2 classes with appropriate text colors for dark bg */}
            <span className="block heading-1 text-gray-200 mb-1">{titlePart1}</span>
            <span className="block heading-2 text-white">{titlePart2}</span>
          </h2>
          {/* Apply body-text-dark class AND prose */}
          <div className="prose body-text-dark mb-6 text-lg">
            {text}
          </div>
          <div className="w-fit">
            {/* Apply btn-primary-dark-bg class */}
            <Link
              href={buttonLink || '#'}
              className="btn-primary-dark-bg"
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