import React from 'react';
import Link from 'next/link';
import NewsletterSection from '../sections/NewsletterSection';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row md:justify-between md:max-w-8xl gap-8">
        {/* Brand & Copyright */}
        <div className="mb-6 md:mb-0">
          <div className="font-heading1 text-3xl text-creme mb-2">Sophron Studies</div>
          <div className="text-gray-400 text-sm mb-6">&copy; {new Date().getFullYear()} Sophron Studies. All rights reserved.</div>
          {/* Newsletter Signup */}
        <div className="w-full md:w-1/3">
          <div className="font-semibold mb-1 text-creme">Newsletter</div>
          <NewsletterSection
            size="compact"
            title="Newsletter"
            subtitle="Subscribe to our newsletter"
            placeholderText="Your email"
            buttonText="Subscribe"
            source="website.footer"
          />
        </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold mb-1 text-creme">Quick Links</div>
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-gold transition-colors text-base"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 