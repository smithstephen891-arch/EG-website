import type { Metadata } from "next";
import { Inter, Corben } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonationProvider } from "@/context/DonationContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Elizabeth's Gift — Lifting Up and Living Fully",
  description:
    "Elizabeth's Gift is a nonprofit organization dedicated to providing mobility and medical equipment to underserved individuals who need it but cannot afford it.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${corben.variable} antialiased`}>
        <DonationProvider>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
        </DonationProvider>
      </body>
    </html>
  );
}
