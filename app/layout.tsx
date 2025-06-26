import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rates & Inventory Management',
  description: 'Enterprise-grade Rates & Inventory Management Platform with AI-powered insights',
};

/**
 * RootLayout for modern enterprise UI - full screen without card wrapper
 * Applies the Inter font and creates a clean, full-screen interface
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
} 