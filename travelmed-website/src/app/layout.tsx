import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/shared/providers/CartProvider";
import { Chatbot } from "@/shared/ui/Chatbot";
import { JsonLd, organizationSchema } from "@/shared/seo/StructuredData";
import { site } from "@/shared/config/site";
import { GA_MEASUREMENT_ID } from "@/shared/analytics/gtag";
import { ProductProvider } from "@/shared/providers/ProductProvider";
import { getCatalog } from "@/shared/api/product";

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B4F8C',
};

const defaultTitle = 'Travel Medical Kit for International Trips | TravelMed';
// Price is intentionally not in site-wide copy: it is admin-managed and shown on product pages
const defaultDescription =
  'Doctor-curated travel medical kit for Indians travelling abroad: 150+ medicines, a signed prescription & 2 free doctor consults. Free shipping in India.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: "%s | TravelMed",
  },
  description: defaultDescription,
  applicationName: site.name,
  authors: [{ name: site.founder.name, url: site.founder.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  category: "health",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin-managed product (price, MRP, stock) — cached and refreshed when the admin saves
  const catalog = await getCatalog();

  return (
    <html lang="en-IN" className="h-full">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body suppressHydrationWarning
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <ProductProvider catalog={catalog}>
          <CartProvider>
            {children}
            <Chatbot />
          </CartProvider>
        </ProductProvider>

        {GA_MEASUREMENT_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
