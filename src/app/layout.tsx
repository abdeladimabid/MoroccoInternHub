import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Morocco InternHub | Find Your Next Tech Internship",
  description: "The most comprehensive platform for tech internships in Morocco. Real-time scanning of all major job boards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
