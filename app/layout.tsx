import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "MsaFacture — Facturation pour Entrepreneurs Africains",
    template: "%s | MsaFacture",
  },
  description:
    "Gérez vos factures, clients et finances en FCFA. La solution de facturation simple et professionnelle pour les entrepreneurs africains.",
  keywords: ["facturation", "facture", "FCFA", "Afrique", "Sénégal", "entrepreneur", "SaaS"],
  authors: [{ name: "MsaFacture" }],
  openGraph: {
    title: "MsaFacture",
    description: "Facturation professionnelle pour entrepreneurs africains",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
