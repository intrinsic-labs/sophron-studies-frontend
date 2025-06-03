'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CartButton from '../shop/CartButton';

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'SHOP', href: '/shop' },
  { name: 'BLOG', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Disable background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [menuOpen]);

  return (
    <nav className="bg-white border-b border-olive sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="font-heading1 text-3xl text-gray-900 tracking-tight">
          Sophron Studies
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-medium text-gray-900 hover:text-pink transition-colors px-2 py-1 ${pathname === link.href ? ' text-pink' : ''}`}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
          <CartButton />
        </div>
        {/* Mobile Hamburger and Cart */}
        <div className="md:hidden flex items-center gap-2">
          <CartButton />
          <button
            className="flex flex-col gap-1.5 p-2 focus:outline-hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block w-7 h-0.5 bg-gray-900 rounded-sm"></span>
            <span className="block w-7 h-0.5 bg-gray-900 rounded-sm"></span>
            <span className="block w-7 h-0.5 bg-gray-900 rounded-sm"></span>
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all">
          <button
            className="absolute top-6 right-6 text-3xl text-gray-900 focus:outline-hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>
          <div className="flex flex-col gap-8 text-5xl font-heading2 items-center">
            {navLinks.map(link => (
              <button
                key={link.name}
                className={`bg-transparent border-none p-0 m-0 text-gray-900 hover:text-gold transition-colors focus:outline-hidden ${pathname === link.href ? 'text-gold' : ''}`}
                style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => {
                  setMenuOpen(false);
                  if (pathname !== link.href) {
                    window.location.href = link.href;
                  }
                }}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 