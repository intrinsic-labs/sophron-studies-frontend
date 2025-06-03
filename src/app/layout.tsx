import type { Metadata } from "next";
// Remove default fonts if not needed, or configure custom fonts later
// import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/scaffold/Layout"; // Import the new Layout component
import { CartProvider } from "@/lib/cart-context"; // Import the CartProvider
import { fontInter, fontLiterata, fontNorthwell } from "@/lib/fonts"; // Import local fonts

import "./globals.css";

export const metadata: Metadata = {
  title: "Sophron Studies", // Update site title
  description: "Reformed Bible studies for women.", // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure body is the only direct child. 
          Remove comments between <html> and <body> just in case */}
      <body 
        className={`${fontInter.variable} ${fontLiterata.variable} ${fontNorthwell.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Layout>{children}</Layout>
        </CartProvider>
      </body>
    </html>
  );
}
