
import './theme-config.css';
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from './providers';
import {
  ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster";

import Navbar from '@/components/navbar/Navbar';

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});



export const metadata: Metadata = {
  title: "Record Retention Application",
  description: "Designed by City of Rocky Mount Technology Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>


        <Providers>
        <Navbar/>

        <main className='container py-10'>{children}</main>
    
        <Toaster />
        </Providers>

      </body>
    </html>
    </ClerkProvider>
  );
}
