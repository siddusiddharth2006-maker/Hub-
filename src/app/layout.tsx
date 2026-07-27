import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Hub House Cafe | Premium QR-Based Smart Restaurant Ordering Platform",
  description: "Ultra-premium mobile-first digital dining experience for Hub House Cafe. Scan table QR code to browse live menu, custom food animations, instant checkout, and real-time kitchen tracking.",
  keywords: ["Hub House Cafe", "QR Restaurant Menu", "Smart Dining", "Digital Restaurant Ordering", "VisionOS UI", "Next.js 15"],
  authors: [{ name: "Hub House Cafe Team" }],
  openGraph: {
    title: "Hub House Cafe | Luxury QR Smart Restaurant System",
    description: "Scan table QR code for live menu, 3D food animations, instant UPI checkout, and real-time order tracking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-white selection:bg-[#FF6B00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
