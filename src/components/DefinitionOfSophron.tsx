import Image from "next/image";
import React from "react";

interface DefinitionOfSophronProps {
  titlePart1: string;
  titlePart2: string;
  definitionText: React.ReactNode;
  importantPointTitle: string;
  importantPointText: React.ReactNode;
  imageUrl1: string;
  imageUrl2: string;
  imageAlt: string;
}

const DefinitionOfSophron: React.FC<DefinitionOfSophronProps> = ({
  titlePart1,
  titlePart2,
  definitionText,
  importantPointTitle,
  importantPointText,
  imageUrl1,
  imageUrl2,
  imageAlt,
}) => {
  return (
    <section className="pt-24 md:pt-32 bg-background text-black md:mb-12">
      <div className="container mx-auto px-8 lg:px-24">
        {/* Definition Part */}
        <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24">
          {/* Text first on mobile, second on desktop */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <h2 className="mb-4">
              <span className="block heading-1 text-gray-700 mb-1">{titlePart1}</span>
              <span className="block heading-2 text-gray-800 mb-8">{titlePart2}</span>
            </h2>
            <div className="prose body-text-light text-lg">
              {definitionText}
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-64 md:h-96 mb-20 md:mb-12 md:mr-12 mt-24 md:mt-0 order-2 md:order-1">
            {/* Overlapping Images */}
            <div className="absolute top-0 left-0 w-full h-full transform -rotate-6 -translate-y-12 -translate-x-12 shadow-md overflow-hidden">
              {imageUrl1 ? (
                <Image
                  src={imageUrl1}
                  alt={imageAlt + " 1"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-full h-full transform rotate-3 translate-y-12 shadow-md overflow-hidden">
              {imageUrl2 ? (
                <Image
                  src={imageUrl2}
                  alt={imageAlt + " 2"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
          </div>
        </div>

        {/* Important Point Part */}
        <div className="text-center max-w-xl mx-auto">
           <h3 className="heading-3 text-gray-800 mb-4">
             {importantPointTitle}
           </h3>
           <div className="prose body-text-light text-justify text-lg">
             {importantPointText}
           </div>
        </div>
      </div>
    </section>
  );
};

export default DefinitionOfSophron; 