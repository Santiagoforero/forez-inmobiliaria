import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { ensureSeedOnBoot } from "@/lib/supabase";
import { DreamRequestBox } from "@/components/DreamRequestBox";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.forez.com.co"),
  title: {
    default:
      "Forez Inmobiliaria | Compra y venta de propiedades en Bucaramanga, Bogotá y Colombia",
    template: "%s | Forez Inmobiliaria",
  },
  description:
    "Forez Inmobiliaria: expertos en compra y venta de apartamentos, casas y proyectos en Bucaramanga, Bogotá y Colombia. Encuentra las mejores oportunidades inmobiliarias.",
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Forez Inmobiliaria" }],
  openGraph: {
    siteName: "Forez Inmobiliaria",
    title: "Forez Inmobiliaria",
    description:
      "Forez Inmobiliaria: expertos en compra y venta de apartamentos, casas y proyectos en Bucaramanga, Bogotá y Colombia. Encuentra las mejores oportunidades inmobiliarias.",
    url: "https://www.forez.com.co",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/favicon-192.png", width: 192, height: 192 }],
  },
  twitter: {
    card: "summary",
    title: "Forez Inmobiliaria",
    images: ["/favicon-192.png"],
  },
  icons: {
    icon: [
      { url: "/favicono.ico", sizes: "any" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureSeedOnBoot();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Forez Inmobiliaria",
    url: "https://www.forez.com.co",
    logo: "https://www.forez.com.co/favicon-192.png",
  };
  return (
    <html lang="es" className="overflow-x-hidden">
      <body
        className={`${inter.variable} min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 via-white to-slate-100">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <section className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
              <DreamRequestBox />
            </div>
          </section>
          <WhatsAppFloatingButton />
          <Toaster position="top-right" richColors />
          <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs sm:px-6 lg:px-8">
              <span>© {new Date().getFullYear()} Forez Inmobiliaria.</span>
              <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span>Propiedades premium en Colombia.</span>
                <span>forezinmobiliaria@gmail.com</span>
                <span>+57 301 827 2954</span>
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

