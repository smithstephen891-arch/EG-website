import type { Metadata } from "next";
import { Inter, Corben } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import { DonationProvider } from "@/context/DonationContext";
import { OG_IMAGES } from "@/lib/og";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: ["400"],
});

const siteTitle = "Elizabeth's Gift — Lifting Up and Living Fully";
const siteDescription =
  "Elizabeth's Gift is a nonprofit organization dedicated to providing mobility and medical equipment to underserved individuals who need it but cannot afford it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.elizabethsgift.com"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  // The default link preview for every page that does not set its own.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Elizabeth's Gift",
    title: siteTitle,
    description: siteDescription,
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [OG_IMAGES[0].url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth motion-reduce:scroll-auto">
      <body className={`${inter.variable} ${corben.variable} antialiased`}>
        <DonationProvider>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
          <NewsletterPopup />
          <Analytics />
        </DonationProvider>
      </body>
    </html>
  );
}
