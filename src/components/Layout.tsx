import React from 'react';

// TODO: Build out Navbar component
const Navbar = () => {
  return <nav className="bg-gray-200 p-4">Navbar Placeholder</nav>;
};

// TODO: Build out Footer component
const Footer = () => {
  return <footer className="bg-gray-800 text-white p-4 mt-8">Footer Placeholder</footer>;
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 