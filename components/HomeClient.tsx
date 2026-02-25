"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/property-card";
import PropertyMap from "@/components/PropertyMap";
import type { Property } from "@/lib/properties";

const ciudades = ["Bucaramanga", "Bogotá", "Medellín", "Barranquilla", "Cali"];

type HomeClientProps = {
  initialProperties: Property[];
};

export default function HomeClient({ initialProperties }: HomeClientProps) {
  const [busquedaInteligente, setBusquedaInteligente] = useState("");

  const destacadas = useMemo(() => {
    const list = initialProperties.slice(0, 8);
    const q = busquedaInteligente
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
    if (!q) return list;
    const tokens = q.split(/\s+/).filter(Boolean);
    return list.filter((p) => {
      const hay = [p.titulo, p.descripcionCorta, p.descripcionLarga, p.ciudad, p.barrio ?? "", p.tipo]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      return tokens.every((t) => hay.includes(t));
    });
  }, [busquedaInteligente, initialProperties]);

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.9)_0,_#e5e7eb_45%,_#f9fafb_100%)]" />
          <div className="absolute inset-y-0 right-[-16%] w-[52%] opacity-65 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80"
              alt="Propiedad de lujo en Colombia"
              fill
              priority
              className="object-cover mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" />
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-20 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Forez Inmobiliaria
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
              Propiedades premium en{" "}
              <span className="bg-gradient-to-r from-sky-700 via-sky-500 to-sky-300 bg-clip-text text-transparent">
                Colombia
              </span>
            </h1>
            <p className="max-w-lg text-pretty text-sm text-slate-600 sm:text-base">
              Encuentra tu hogar ideal en Bucaramanga, Bogotá, Medellín y las
              principales ciudades del país. Asesoría personalizada, curaduría
              de propiedades y un servicio diseñado para clientes exigentes.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80 backdrop-blur-xl sm:p-5"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Búsqueda avanzada
              </p>
              <form className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Ciudad
                  </label>
                  <Input
                    placeholder="Bucaramanga, Bogotá..."
                    className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                    list="ciudades"
                  />
                  <datalist id="ciudades">
                    {ciudades.map((ciudad) => (
                      <option key={ciudad} value={ciudad} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Presupuesto máx.
                  </label>
                  <Input
                    placeholder="$1.000.000.000"
                    className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Tipo de propiedad
                  </label>
                  <Input
                    placeholder="Apartamento, casa..."
                    className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-slate-500">
                    Filtraremos opciones según tu perfil y te acompañaremos en
                    todo el proceso.
                  </p>
                  <Button
                    type="submit"
                    className="bg-[#0A2540] px-5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#0A2540]/50 hover:bg-[#103463]"
                  >
                    Buscar propiedades
                  </Button>
                </div>
              </form>
            </motion.div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Más de 10 años asesorando inversiones inmobiliarias.
              </span>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8 sm:text-3xl lg:text-4xl lg:mb-10">
              Propiedades Destacadas
            </h2>
            <div className="mx-auto mb-8 w-full max-w-2xl">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Búsqueda inteligente
              </label>
              <Input
                value={busquedaInteligente}
                onChange={(e) => setBusquedaInteligente(e.target.value)}
                className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="Ej: terraza, Chicó, penthouse, inversión, vista…"
              />
            </div>
            {destacadas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {destacadas.map((p) => (
                  <PropertyCard key={p.slug} property={p} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-12">
                No hay propiedades que coincidan con tu búsqueda. Ajusta los filtros o{" "}
                <Link href="/propiedades" className="text-sky-600 underline">explora todas las propiedades</Link>.
              </p>
            )}
          </section>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Explora en mapa
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                Mapa 3D con clustering y detalles
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Navega por Colombia, agrupa puntos automáticamente y abre fichas
                rápidas con acceso directo al detalle.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-slate-300 bg-white text-xs font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-50"
            >
              <Link href="/propiedades">Ver todas las propiedades</Link>
            </Button>
          </div>

          <PropertyMap properties={initialProperties} heightClassName="h-[320px] sm:h-[420px] lg:h-[520px]" />
        </div>
      </section>
    </div>
  );
}
