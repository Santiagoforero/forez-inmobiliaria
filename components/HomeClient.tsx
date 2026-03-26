"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import PropertyMap from "@/components/PropertyMap";
import type { Property } from "@/lib/properties";

const ciudades = ["Bucaramanga", "Bogotá", "Medellín", "Barranquilla", "Cali"];

// Misma foto hero en PC y móvil: máxima resolución y nitidez (sin optimizar para evitar pérdida)
const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=2880&q=100";

type HomeClientProps = {
  initialProperties: Property[];
};

export default function HomeClient({ initialProperties }: HomeClientProps) {
  const [busquedaInteligente, setBusquedaInteligente] = useState("");
  const [ciudadAvanzada, setCiudadAvanzada] = useState("");
  const [presupuestoAvanzado, setPresupuestoAvanzado] = useState("");
  const [tipoAvanzado, setTipoAvanzado] = useState("");

  const heroMedia = useMemo(() => {
    const fromProperty = initialProperties.find((p) => p.imagenes?.[0])?.imagenes?.[0];
    return {
      url:
        fromProperty ??
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
      alt: fromProperty ? "Propiedad destacada de Forez" : "Propiedad de lujo en Colombia",
    };
  }, [initialProperties]);

  const [presupuestoMaxNumero, setPresupuestoMaxNumero] = useState<number | null>(null);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const videoSources = [
    "https://videos.pexels.com/video-files/34017546/14428993_2560_1440_60fps.mp4",
    "https://videos.pexels.com/video-files/3015510/3015510-hd_1920_1080_24fps.mp4",
  ];

  const destacadas = useMemo(() => {
    const q = busquedaInteligente
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const filtradas = initialProperties.filter((p) => {
      if (presupuestoMaxNumero != null && p.precio > presupuestoMaxNumero) {
        return false;
      }
      if (tokens.length === 0) return true;
      const hay = [
        p.titulo,
        p.descripcionCorta,
        p.descripcionLarga,
        p.ciudad,
        p.barrio ?? "",
        p.tipo,
      ]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      return tokens.every((t) => hay.includes(t));
    });
    return filtradas.slice(0, 8);
  }, [busquedaInteligente, initialProperties, presupuestoMaxNumero]);

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <h1 className="sr-only">Forez Inmobiliaria</h1>
      {/* Inversión en movimiento: video a todo el ancho, justo bajo la barra */}
      <div className="w-full border-b border-slate-200 bg-black">
        <div className="relative h-[210px] w-full sm:h-[260px] lg:h-[360px]">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80"
            src={videoSources[videoSourceIndex]}
            onError={() =>
              setVideoSourceIndex((prev) =>
                prev < videoSources.length - 1 ? prev + 1 : prev,
              )
            }
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-100 sm:bottom-4 sm:text-xs">
            <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur">
              Inversión en movimiento
            </span>
            <span className="hidden rounded-full bg-black/30 px-3 py-1 text-[9px] tracking-[0.26em] text-slate-200/80 sm:inline">
              Ciudades y activos alrededor del mundo
            </span>
          </div>
        </div>
      </div>

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* PC: gradiente + foto a la derecha (mitad azul, mitad foto), máxima nitidez */}
          <div className="absolute inset-0 hidden lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.9)_0,#e5e7eb_45%,#f9fafb_100%)]" />
            <div className="absolute inset-y-0 right-[-16%] w-[52%] opacity-65">
              <Image
                src={HERO_IMAGE_URL}
                alt="Propiedad de lujo en Colombia"
                fill
                priority
                className="object-cover mix-blend-luminosity"
                sizes="(min-width: 1024px) 900px, 0px"
              />
              <div className="absolute inset-0 bg-linear-to-l from-white via-transparent to-transparent" />
            </div>
          </div>
          {/* Móvil: fondo claro, coherente con PC pero con composición propia */}
          <div className="absolute inset-0 lg:hidden">
            {/* Capa base clara con degradado suave azul/gris */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.95)_0,#e5e7eb_45%,#f9fafb_100%)]" />

            {/* Sutil halo detrás del contenido para destacar el copy */}
            <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-sky-300/15 blur-3xl" />

            {/* Tarjeta luminosa con la foto, anclada a la derecha */}
            <div className="pointer-events-none absolute bottom-[-6%] right-[-18%] h-[56%] w-[76%] -rotate-3">
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl shadow-slate-300/70">
                <Image
                  src={HERO_IMAGE_URL}
                  alt="Propiedad destacada Forez"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1023px) 76vw, 0px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-linear-to-l from-slate-100/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Pequeños acentos claros para dar riqueza sin ensuciar */}
            <div className="pointer-events-none absolute right-[12%] top-[18%] h-16 w-16 rounded-full bg-sky-200/40 blur-2xl" />
            <div className="pointer-events-none absolute right-[34%] bottom-[20%] h-20 w-20 rounded-full bg-emerald-200/35 blur-2xl" />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-20 lg:min-h-[70vh] lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Forez Inmobiliaria
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
              Activos inmobiliarios premium en{" "}
              <span className="bg-linear-to-r from-sky-700 via-sky-500 to-sky-300 bg-clip-text text-transparent">
                Colombia
              </span>
            </h1>
            <p className="max-w-lg text-pretty text-sm text-slate-600 sm:text-base">
              Compraventa de inmuebles, lotes, proyectos sobre planos y activos
              comerciales o industriales en Bucaramanga, Bogotá, Medellín y las
              principales ciudades del país. Asesoría de inversión, curaduría
              de portafolios y un servicio diseñado para clientes exigentes.
            </p>

            <div className="mt-4 flex gap-3 md:hidden">
              <Button
                asChild
                className="flex-1 bg-[#0A2540] text-xs font-semibold text-white shadow-lg shadow-[#0A2540]/40 hover:bg-[#103463]"
              >
                <Link href="/propiedades">Ver propiedades</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-sky-400 text-xs font-semibold text-sky-800 hover:bg-sky-50"
              >
                <Link href="/proyectos">Ver proyectos</Link>
              </Button>
            </div>

            <div className="mt-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80 backdrop-blur-xl sm:p-5 md:block">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Búsqueda avanzada
              </p>
              <form
                className="grid gap-3 sm:grid-cols-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const ciudadToken = ciudadAvanzada.trim();
                  const tipoToken = tipoAvanzado.trim();

                  // Presupuesto se interpreta como tope máximo numérico (no entra al texto)
                  const cleaned = presupuestoAvanzado.replace(/\D/g, "");
                  const maxNumber = cleaned ? Number(cleaned) : null;
                  setPresupuestoMaxNumero(maxNumber);

                  const tokensTexto = [ciudadToken, tipoToken].filter(Boolean);
                  if (tokensTexto.length === 0 && maxNumber == null) return;
                  setBusquedaInteligente(tokensTexto.join(" "));
                  const anchor = document.getElementById("destacadas");
                  if (anchor) {
                    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Ciudad
                  </label>
                  <Input
                    value={ciudadAvanzada}
                    onChange={(e) => setCiudadAvanzada(e.target.value)}
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
                    value={presupuestoAvanzado}
                    onChange={(e) =>
                      setPresupuestoAvanzado(
                        e.target.value
                          .replace(/\D/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                      )
                    }
                    placeholder="$1.000.000.000"
                    className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Tipo de propiedad
                  </label>
                  <Select
                    value={tipoAvanzado || "todas"}
                    onValueChange={(value) =>
                      setTipoAvanzado(value === "todas" ? "" : value)
                    }
                  >
                    <SelectTrigger className="border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400">
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todos</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Bodega">Bodega</SelectItem>
                      <SelectItem value="Lote">Lote</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Más de 10 años asesorando inversiones inmobiliarias.
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Vivienda, comercio, industria y proyectos sobre planos.
              </span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <section id="destacadas" className="mt-16">
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

      <section className="relative z-10 border-t border-slate-200 bg-slate-50">
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

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-700 sm:px-6 lg:px-8 lg:py-14">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Forez Inmobiliaria: asesoría y oportunidades en Colombia
          </h2>
          <div className="mt-3 space-y-4 leading-7">
            <p>
              Forez Inmobiliaria es una firma enfocada en la compra, venta y
              acompañamiento de inversión inmobiliaria en Colombia. Trabajamos
              con un portafolio curado de apartamentos, casas, lotes y proyectos
              sobre planos, con especial atención a la calidad del activo, la
              ubicación y el potencial de valorización.
            </p>
            <p>
              Nuestro equipo acompaña procesos en ciudades como Bucaramanga y su
              área metropolitana, Bogotá, Medellín, Cali y otras zonas clave del
              país. Analizamos variables prácticas que influyen en la decisión:
              conectividad, oferta de servicios, dinámica comercial, entorno y
              comparables de mercado, para que cada cliente tenga claridad antes
              de comprar o vender.
            </p>
            <p>
              Si buscas vivienda o estás construyendo patrimonio, en FOREZ
              encontrarás opciones con información completa: imágenes, detalles,
              contexto del entorno, documentación cuando aplica y asesoría
              personalizada. Nuestro objetivo es ayudarte a tomar decisiones
              informadas, con criterio técnico y visión de largo plazo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
