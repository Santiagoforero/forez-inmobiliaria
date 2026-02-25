import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { ensureSeedOnBoot } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forez Inmobiliaria - Propiedades premium en Colombia",
  description:
    "Forez Inmobiliaria: compra y venta de propiedades premium en Bucaramanga, Bogotá, Medellín y más ciudades de Colombia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureSeedOnBoot();
  return (
    <html lang="es" className="overflow-x-hidden">
      <body
        className={`${inter.variable} min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
          <Navbar />
          <main className="flex-1">{children}</main>
          <WhatsAppFloatingButton />
          <Toaster position="top-right" richColors />
          <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
              <span>© {new Date().getFullYear()} Forez Inmobiliaria.</span>
              <span>Propiedades premium en Colombia.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

