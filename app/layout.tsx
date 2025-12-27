import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BYZCLUB - Accélérateur de Communication Locale à Neuchâtel",
  description: "BYZCLUB est l'accélérateur de communication pour les entrepreneurs et commerçants de Neuchâtel. Formation, communauté et services pros pour booster votre visibilité locale.",
  keywords: ["communication", "neuchâtel", "marketing local", "réseaux sociaux", "entrepreneurs", "commerces locaux"],
  authors: [{ name: "BYZCLUB" }],
  openGraph: {
    title: "BYZCLUB - Accélérateur de Communication Locale",
    description: "Boostez la visibilité de votre commerce local avec BYZCLUB à Neuchâtel",
    type: "website",
    locale: "fr_CH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
