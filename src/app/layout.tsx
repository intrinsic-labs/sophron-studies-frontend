import type { Metadata } from "next";
// Remove default fonts if not needed, or configure custom fonts later
// import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Layout"; // Import the new Layout component
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
      {/* Remove font variables if default fonts are removed */}
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className="antialiased"> {/* Apply base styling */}
        <Layout>{children}</Layout> {/* Wrap children with the Layout component */}
      </body>
    </html>
  );
}
