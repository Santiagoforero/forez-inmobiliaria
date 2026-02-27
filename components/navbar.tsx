"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

type UserSummary = {
  email: string;
};

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.user?.email) {
          setUser({ email: data.user.email });
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user?.email) {
        setUser({ email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.email === "forezinmobiliaria@gmail.com";
  const displayName =
    user?.email?.split("@")[0].replace(/\./g, " ").replace(/^\w/, (c) =>
      c.toUpperCase(),
    ) ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/logo.png"
              alt="Forez Inmobiliaria"
              fill
              className="object-contain"
              sizes="36px"
              priority
            />
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] text-slate-900 sm:flex sm:flex-col sm:leading-tight">
            <span className="tracking-[0.25em]">FOREZ</span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-slate-500 sm:inline">
              Inmobiliaria
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden flex-col items-end text-xs sm:flex">
                <span className="font-medium text-slate-700">
                  Hola {displayName || "cliente"}
                </span>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                  onClick={() => {
                    window.open(
                      "https://wa.me/573018272954?text=Hola,%20quiero%20publicar%20una%20propiedad%20con%20Forez",
                      "_blank",
                    );
                  }}
                >
                  ¿Quieres publicar con nosotros?
                </button>
              </div>
              {isAdmin && (
                <Button
                  asChild
                  className="hidden bg-emerald-600 text-xs font-semibold text-white shadow-md shadow-emerald-400/40 hover:bg-emerald-700 sm:inline-flex"
                >
                  <Link href="/publicar">Publicar propiedad</Link>
                </Button>
              )}
              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  className="hidden border-sky-400 text-xs font-semibold text-sky-800 hover:bg-sky-50 sm:inline-flex"
                >
                  <Link href="/proyectos/publicar">Publicar proyecto</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden border-slate-300 bg-white text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-50 md:inline-flex"
              >
                <Link href="/auth">Ingresar</Link>
              </Button>
              <Button
                asChild
                className="hidden bg-[#0A2540] text-sm font-semibold text-white shadow-lg shadow-[#0A2540]/40 hover:bg-[#103463] md:inline-flex"
              >
                <Link href="/auth">Crear cuenta</Link>
              </Button>
            </>
          )}

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 md:hidden"
                aria-label="Menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-slate-200 bg-white">
              <SheetHeader>
                <SheetTitle className="text-left text-xs font-semibold tracking-[0.25em] text-slate-500">
                  INMOBILIARIA PREMIUM
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4 text-sm font-medium text-slate-700">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className={`rounded-md px-2 py-1.5 transition-colors ${
                        active
                          ? "bg-[#0A2540] text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <button
                      type="button"
                      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                      onClick={() => {
                        window.open(
                          "https://wa.me/573018272954?text=Hola,%20quiero%20publicar%20una%20propiedad%20con%20Forez",
                          "_blank",
                        );
                        setSheetOpen(false);
                      }}
                    >
                      ¿Quieres publicar con nosotros?
                    </button>
                    {isAdmin && (
                      <Button
                        asChild
                        className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Link href="/publicar" onClick={() => setSheetOpen(false)}>
                          Publicar propiedad
                        </Link>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        asChild
                        variant="outline"
                        className="text-xs font-semibold text-sky-800 hover:bg-sky-50"
                      >
                        <Link
                          href="/proyectos/publicar"
                          onClick={() => setSheetOpen(false)}
                        >
                          Publicar proyecto
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="border-slate-300 bg-white text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                    >
                      <Link href="/auth" onClick={() => setSheetOpen(false)}>
                        Ingresar
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-[#0A2540] text-sm font-semibold text-white shadow-lg shadow-[#0A2540]/40 hover:bg-[#103463]"
                    >
                      <Link href="/auth" onClick={() => setSheetOpen(false)}>
                        Crear cuenta
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

