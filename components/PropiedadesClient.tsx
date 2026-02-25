"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/lib/properties";
import PropertyMap from "@/components/PropertyMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type PropiedadesClientProps = {
  initialProperties: Property[];
};

export default function PropiedadesClient({ initialProperties }: PropiedadesClientProps) {
  const [verMapa, setVerMapa] = useState(false);
  const [busquedaInteligente, setBusquedaInteligente] = useState("");
  const [ciudad, setCiudad] = useState<string>("todas");
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [habSeleccionadas, setHabSeleccionadas] = useState<number[]>([]);

  const precios = initialProperties.map((p) => p.precio);
  const minPrecio = precios.length > 0 ? Math.min(...precios) : 0;
  const maxPrecio = Math.max(5000000000, ...precios);
  const [precioMax, setPrecioMax] = useState<number>(maxPrecio);

  const metrosList = initialProperties.map((p) => p.metros);
  const minMetros = metrosList.length > 0 ? Math.min(...metrosList) : 0;
  const maxMetros = Math.max(5000, ...metrosList);
  const [metrosMin, setMetrosMin] = useState<number>(minMetros);

  const ciudadesUnicas = Array.from(
    new Set(initialProperties.map((p) => p.ciudad)),
  );
  const tiposUnicos = Array.from(new Set(initialProperties.map((p) => p.tipo)));
  const habUnicas = Array.from(
    new Set(initialProperties.map((p) => p.habitaciones)),
  ).sort((a, b) => a - b);

  const propiedadesFiltradas = useMemo(() => {
    return initialProperties.filter((p: Property) => {
      const q = busquedaInteligente
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();
      if (q) {
        const tokens = q.split(/\s+/).filter(Boolean);
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
        if (!tokens.every((t) => hay.includes(t))) return false;
      }
      if (ciudad !== "todas" && p.ciudad !== ciudad) return false;
      if (p.precio > precioMax) return false;
      if (p.metros < metrosMin) return false;
      if (tiposSeleccionados.length && !tiposSeleccionados.includes(p.tipo)) {
        return false;
      }
      if (
        habSeleccionadas.length &&
        !habSeleccionadas.includes(p.habitaciones)
      ) {
        return false;
      }
      return true;
    });
  }, [
    initialProperties,
    busquedaInteligente,
    ciudad,
    precioMax,
    metrosMin,
    tiposSeleccionados,
    habSeleccionadas,
  ]);

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Portafolio Forez
              </p>
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Propiedades premium en{" "}
                <span className="bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent">
                  Colombia
                </span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Filtra por ciudad, tipo, presupuesto, área y habitaciones. Activa el
                mapa para explorar puntos con clustering y popups.
              </p>
            </div>
            <Button
              onClick={() => setVerMapa((v) => !v)}
              className="bg-[#0A2540] text-sm font-semibold text-white shadow-lg shadow-[#0A2540]/40 hover:bg-[#103463]"
            >
              {verMapa ? "Ocultar mapa" : "Ver en mapa"}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {verMapa && (
            <div className="mb-10">
              <PropertyMap properties={propiedadesFiltradas} heightClassName="h-[320px] sm:h-[420px] lg:h-[520px]" />
            </div>
          )}

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/70 lg:w-80 lg:flex-none">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Filtros
              </p>

              <div className="mt-4 space-y-4 text-xs text-slate-600">
                <div>
                  <label className="mb-1 block font-medium">Búsqueda inteligente</label>
                  <Input
                    value={busquedaInteligente}
                    onChange={(e) => setBusquedaInteligente(e.target.value)}
                    className="h-9 border-slate-300 bg-white text-xs"
                    placeholder="Ej: terraza, Chicó, inversión, vista…"
                  />
                </div>

                <div>
                  <p className="mb-1 font-medium">Ciudad</p>
                  <Select value={ciudad} onValueChange={(value) => setCiudad(value)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white text-xs">
                      <SelectValue placeholder="Todas las ciudades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {ciudadesUnicas.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <p className="flex items-center justify-between font-medium">
                    Precio máximo
                    <span className="text-[11px] font-normal text-slate-500">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(precioMax)}
                    </span>
                  </p>
                  <Slider
                    value={[precioMax]}
                    min={minPrecio}
                    max={maxPrecio}
                    step={50000000}
                    onValueChange={([v]) => setPrecioMax(v)}
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="flex items-center justify-between font-medium">
                    Metros mínimos
                    <span className="text-[11px] font-normal text-slate-500">
                      {metrosMin} m²
                    </span>
                  </p>
                  <Slider
                    value={[metrosMin]}
                    min={minMetros}
                    max={maxMetros}
                    step={10}
                    onValueChange={([v]) => setMetrosMin(v)}
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="font-medium">Tipo de propiedad</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tiposUnicos.map((tipo) => {
                      const checked = tiposSeleccionados.includes(tipo);
                      return (
                        <label
                          key={tipo}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-2 text-[11px] hover:bg-slate-50"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              setTiposSeleccionados((prev) =>
                                value
                                  ? [...prev, tipo]
                                  : prev.filter((t) => t !== tipo),
                              );
                            }}
                            className="h-3.5 w-3.5"
                          />
                          <span>{tipo}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="font-medium">Habitaciones</p>
                  <div className="flex flex-wrap gap-2">
                    {habUnicas.map((h) => {
                      const checked = habSeleccionadas.includes(h);
                      return (
                        <label
                          key={h}
                          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] hover:bg-slate-50"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              setHabSeleccionadas((prev) =>
                                value
                                  ? [...prev, h]
                                  : prev.filter((v) => v !== h),
                              );
                            }}
                            className="h-3.5 w-3.5"
                          />
                          <span>{h} hab</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-slate-300 bg-white text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  onClick={() => {
                    setBusquedaInteligente("");
                    setCiudad("todas");
                    setTiposSeleccionados([]);
                    setHabSeleccionadas([]);
                    setPrecioMax(maxPrecio);
                    setMetrosMin(minMetros);
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              {propiedadesFiltradas.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 justify-items-center"
                >
                  {propiedadesFiltradas.map((propiedad) => (
                    <div key={propiedad.slug} className="w-full max-w-sm">
                      <PropertyCard property={propiedad} showNeighborhood />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <p className="py-16 text-center text-slate-500">
                  No hay propiedades que coincidan con los filtros. Prueba a ampliarlos.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
