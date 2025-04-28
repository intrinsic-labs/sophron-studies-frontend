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
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center h-full">
        {/* Image Container - Uses flex to center the inner relative container */}
        <div className="w-full md:w-2/5 mb-12 md:mb-0 md:mr-12 order-1 flex justify-center items-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
          {/* Inner Relative Container - Defines the aspect ratio and positioning context */}
          <div className="relative w-4/5 aspect-[4/3]"> {/* Adjust aspect ratio as needed */}
            {/* First Image - Positioned absolutely using percentages */}
            <div className="absolute -bottom-[3%] left-[7%] w-[65%] aspect-[2/3] shadow-lg rounded overflow-hidden z-10">
              <Image
                src={imageUrl1}
                alt={imageAlt + " 1"}
                fill
                style={{ objectFit: 'cover' }} // Use fill and objectFit
                className="rounded"
                priority
              />
            </div>
            {/* Second Image - Positioned absolutely using percentages */}
            <div className="absolute -top-[3%] right-[7%] w-[65%] aspect-[2/3] shadow-lg rounded overflow-hidden z-20">
              <Image
                src={imageUrl2}
                alt={imageAlt + " 2"}
                fill
                style={{ objectFit: 'cover' }} // Use fill and objectFit
                className="rounded"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-2/5 order-2 flex flex-col justify-center">
          <h2 className="mb-4">
             {/* Adjust text colors for dark background */}
            <span className="block font-heading1 text-5xl text-gray-200 mb-1">{titlePart1}</span>
            <span className="block font-heading2 text-4xl uppercase text-white">{titlePart2}</span>
          </h2>
          <div className="prose max-w-none text-gray-300 mb-6">
            {text}
          </div>
          <Link
            href={buttonLink}
            className="inline-block bg-white text-gray-900 py-2 px-6 rounded hover:bg-gray-200 transition duration-300 uppercase text-sm tracking-wider"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingRelease; 