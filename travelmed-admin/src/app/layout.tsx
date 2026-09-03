import React from 'react';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Travel Med - Admin Dashboard',
  description: 'Premium internal management panel for Travel Med products, orders, and consultations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className={`${inter.variable} ${plusJakartaSans.variable} min-h-screen bg-[#F8FAFC] text-slate-600 flex flex-col antialiased selection:bg-teal-500 selection:text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
