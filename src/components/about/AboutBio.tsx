import React from 'react';
import { PortableText } from '@portabletext/react';

interface AboutBioProps {
  heading: string;
  body: any[];
}

const AboutBio: React.FC<AboutBioProps> = ({ heading, body }) => {
  return (
    <section className="mb-12 lg:py-16 bg-white">
      <div className="max-w-2xl mx-auto text-center px-8">
        <h2 className="text-3xl md:text-4xl font-heading2 uppercase mb-6">{heading}</h2>
        <div className="space-y-6 text-xl text-black leading-relaxed prose mx-auto text-justify font-serif">
          <PortableText value={body} />
        </div>
      </div>
    </section>
  );
};

export default AboutBio; 