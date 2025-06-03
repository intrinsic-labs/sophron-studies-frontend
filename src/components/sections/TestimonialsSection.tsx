'use client';

import React, { useState, useEffect } from 'react';

interface Testimonial {
  text: string;
  citation: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title,
  subtitle,
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, wait 0.5s then change testimonial and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
        
        // Wait 0.5s before fading in
        setTimeout(() => {
          setIsVisible(true);
        }, 500);
      }, 300); // Fade out duration
    }, 8000); // 8 seconds total cycle

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="md:pb-16 bg-background text-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center bg-[var(--olive)]">
        <div className="w-full max-w-4xl text-center py-12 md:py-16">
          {/* Section Header */}
          {(title || subtitle) && (
            <div className="mb-12">
              {title && (
                <h2 className="heading-2 text-4xl md:text-6xl text-gray-700 mb-2">{title}</h2>
              )}
              {subtitle && (
                <p className="body-text text-gray-600">{subtitle}</p>
              )}
            </div>
          )}

          {/* Testimonial Container with Fixed Height */}
          <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
            {/* Testimonial Card */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="p-8 md:p-12 max-w-3xl w-full flex flex-col justify-center min-h-full">
                {/* Quote Text */}
                <blockquote className="mb-6">
                  <p className="text-lg md:text-xl font-light text-gray-800 leading-relaxed">
                    {currentTestimonial.text}
                  </p>
                </blockquote>
                
                {/* Citation */}
                <cite className="block text-lg md:text-xl text-gray-600 font-medium">
                  {currentTestimonial.citation}
                </cite>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsVisible(true);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex 
                      ? 'bg-gray-700' 
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 