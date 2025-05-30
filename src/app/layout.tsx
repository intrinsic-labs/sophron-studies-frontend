import type { Metadata } from "next";
// Remove default fonts if not needed, or configure custom fonts later
// import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Layout"; // Import the new Layout component
import { CartProvider } from "@/lib/cart-context"; // Import the CartProvider
import { fontInter, fontLiterata, fontOoohBaby, fontCardo } from "@/lib/fonts"; // Import the font definitions
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
        className={`${fontInter.variable} ${fontLiterata.variable} ${fontOoohBaby.variable} ${fontCardo.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Layout>{children}</Layout>
        </CartProvider>
      </body>
    </html>
  );
}
