import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/shared/providers/CartProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Travel Med - Premium Travel Healthcare & Medical Kits",
  description: "Your Health. Your Journey. Always Protected. The premium international travel medical kit combined with instant US/EU doctor consultations worldwide.",
  keywords: ["travel medicine", "travel clinic", "travel health kit", "first aid kit", "online travel doctor", "doctor consultation abroad"],
  openGraph: {
    title: "Travel Med - Premium Travel Healthcare & Medical Kits",
    description: "Secure your journey with TSA-friendly medical kits and instant physician support anywhere in the world.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Med - Premium Travel Healthcare",
    description: "Premium travel medical kits combined with doctor teleconsultation.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
