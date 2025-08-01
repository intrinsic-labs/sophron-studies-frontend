import React from 'react';
import Navbar from '../scaffold/Navbar';
import Footer from '../scaffold/Footer';
import CartSidebar from '../shop/CartSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout; 