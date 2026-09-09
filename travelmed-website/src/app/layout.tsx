import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/shared/providers/CartProvider";
import { Chatbot } from "@/shared/ui/Chatbot";
import { JsonLd, organizationSchema, productSchema } from "@/shared/seo/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelmed.org';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TravelMed | Complete Travel Medical Kit & 24/7 Global Telehealth",
    template: "%s | TravelMed Travel Healthcare"
  },
  description: "WHO, GMP, CDSCO & DCGI Approved travel medical pouch featuring 150+ prescription & OTC remedies across 4 color-coded triage zones. Paired with instant 24/7 global video doctor consultations.",
  keywords: [
    "best travel medical kit",
    "travel medicine kit",
    "international travel first aid kit",
    "prescription travel medical kit",
    "travel health pouch with doctor prescription",
    "family travel medical kit",
    "TSA approved travel medicine kit",
    "bali belly medicine kit",
    "altitude sickness pills travel",
    "southeast asia travel medicine list",
    "travel medicine for europe trip",
    "medicines to take to thailand",
    "traveler diarrhea kit",
    "online doctor consultation while traveling",
    "telehealth for international travelers",
    "get doctor prescription abroad online",
    "24/7 video doctor travel emergency",
    "travel clinic online video call",
    "WHO GMP approved travel medical kit",
    "CDSCO DCGI approved travel prescription",
    "taking prescription medicines through airport customs",
    "customs friendly travel medicine pouch"
  ],
  authors: [{ name: "TravelMed Medical Editorial Board" }],
  creator: "TravelMed Global Healthcare Systems",
  publisher: "TravelMed Healthcare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "TravelMed | Complete Travel Medical Kit & 24/7 Global Telehealth",
    description: "Secure your trip with WHO, GMP, CDSCO & DCGI approved travel medical kits and instant doctor video consultations anywhere in the world.",
    url: siteUrl,
    siteName: "TravelMed Healthcare",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TravelMed Medical Pouch & 24/7 Global Telehealth Consultation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelMed | Travel Medical Kit & 24/7 Doctor Consultations",
    description: "WHO & GMP approved medical kit with 150+ remedies + instant 24/7 video doctor access worldwide.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@travelmed_official",
  },
  category: "Medical & Health Travel Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={productSchema} />
      </head>
      <body suppressHydrationWarning
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <CartProvider>
          {children}
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
