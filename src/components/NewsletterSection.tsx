import React from 'react';

// TODO: Add form submission logic (e.g., Formspree or API route)

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  buttonText?: string;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = "Stay in Touch",
  subtitle = "Join our newsletter now! We will keep you posted on the latest and greatest.",
  placeholderText = "name@example.com",
  buttonText = "Submit",
}) => {
  return (
    <section className="py-16 border-t">
      <div className="container max-w-4xl mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-2/5 mb-8 md:mb-0">
            <h2 className="heading-1 mb-2 text-5xl">{title}</h2>
            <p className="body-text-subtle text-lg">{subtitle}</p>
          </div>
          <div className="w-full md:w-1/2">
            <form className="flex">
              <input 
                type="email" 
                placeholder={placeholderText}
                required
                className="flex-grow p-3 border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-800"
              />
              <button 
                type="submit" 
                className="btn-submit"
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 