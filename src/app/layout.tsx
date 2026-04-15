import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morocco Internship Hub — Stages IT au Maroc",
  description:
    "Trouvez les meilleures offres de stage et d'emploi en informatique au Maroc. Agrégateur temps réel de Stage.ma, Rekrute, Emploi.ma et plus.",
  keywords: [
    "stage informatique maroc",
    "internship morocco",
    "emploi IT maroc",
    "développeur web maroc",
    "stage casablanca",
    "rekrute stage",
  ],
  openGraph: {
    title: "Morocco Internship Hub",
    description: "Les meilleures offres de stage IT au Maroc, en temps réel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
