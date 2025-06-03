'use client';
import React, { useState } from 'react';

// TODO: Add form submission logic (e.g., Formspree or API route)

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  buttonText?: string;
  source?: string;
  size?: 'full' | 'compact';
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = "Stay in Touch",
  subtitle = "Join our newsletter now! We will keep you posted on the latest and greatest.",
  placeholderText = "name@example.com",
  buttonText = "SUBSCRIBE",
  source = 'website',
  size = 'full',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: source || 'website',
          signupDate: new Date().toISOString(),
          // Optional: Add custom fields if needed
          // customFields: [
          //   { name: 'Source', value: 'Website Footer' }
          // ]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage(data.message || 'Successfully subscribed to our newsletter!');
      setEmail(''); // Clear the form
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('already subscribed')) {
          setMessage('This email is already subscribed to our newsletter.');
        } else if (error.message.includes('configuration error')) {
          setMessage('Newsletter service is temporarily unavailable. Please try again later.');
        } else {
          setMessage(error.message);
        }
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  // Compact version for footers/sidebars
  if (size === 'compact') {
    return (
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholderText}
            required
            disabled={status === 'loading'}
            className="flex-grow p-2 text-sm text-black border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </form>
        
        {/* Compact Status Messages */}
        {message && (
          <div className={`mt-2 p-2 text-xs rounded ${
            status === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : status === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : ''
          }`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // Full version (original layout)
  return (
    <section className="py-16 border-t">
      <div className="container max-w-4xl mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-2/5 mb-8 md:mb-0">
            <h2 className="heading-1 mb-2 text-5xl">{title}</h2>
            <p className="body-text-subtle text-lg">{subtitle}</p>
          </div>
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} className="flex">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderText}
                required
                disabled={status === 'loading'}
                className="flex-grow p-3 border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn-submit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : buttonText}
              </button>
            </form>
            
            {/* Status Messages */}
            {message && (
              <div className={`mt-3 p-2 text-sm rounded ${
                status === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : status === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : ''
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 