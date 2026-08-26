import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./townies.css";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const siteTitle = "Townies Open";
const siteDescription =
  "The Official Golf Tournament of Unofficial Golf returns April 17–18, 2027. Sign up to hear when registration and details go live.";

export const metadata: Metadata = {
  metadataBase: new URL("https://towniesgolf.com"),
  title: siteTitle,
  description: siteDescription,
  // Explicit paths into public/ — app-dir icon file conventions inside a
  // route group serve under hashed URLs, so they aren't used here.
  icons: {
    icon: [{ url: "/images/townies/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/images/townies/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Townies Open",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/townies/og.png",
        width: 1200,
        height: 630,
        alt: "Townies Open — April 17–18, 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/townies/og.png"],
  },
};

export default function TowniesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth motion-reduce:scroll-auto">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
