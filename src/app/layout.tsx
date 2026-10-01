import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EL ARCA MARKET | Punto de Venta & Admin",
    template: "%s | EL ARCA MARKET",
  },
  description: "Sistema avanzado de punto de venta (POS) y gestión de inventario para El Arca Market. Incluye reportes financieros, control de lotes y ventas pendientes.",
  keywords: ["POS", "Punto de Venta", "Inventario", "El Arca Market", "Sistema de ventas", "Dashboard"],
  authors: [{ name: "El Arca Market" }],
  creator: "El Arca Market",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "EL ARCA MARKET | Punto de Venta Premium",
    description: "Gestión y punto de venta para El Arca Market.",
    siteName: "El Arca Market",
  },
  twitter: {
    card: "summary_large_image",
    title: "EL ARCA MARKET",
    description: "Gestión y punto de venta para El Arca Market.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#090A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
