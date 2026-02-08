import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SearchCommand from "@/components/SearchCommand";
import CustomCursor from "@/components/CustomCursor";
import { CartProvider } from "../context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Commerce - Premium E-Commerce Platform",
  description: "Discover premium products with seamless shopping experience. Fast, secure, and elegant.",
  keywords: ["ecommerce", "shopping", "premium", "online store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <CustomCursor />
          <SearchCommand />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
