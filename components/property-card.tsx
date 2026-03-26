"use client";

import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Ruler } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/properties";

type PropertyCardProps = {
  property: Property;
  showNeighborhood?: boolean;
  compact?: boolean;
};

export function PropertyCard({
  property,
  showNeighborhood = false,
  compact = false,
}: PropertyCardProps) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  const precioFormatted = formatter.format(property.precio);
  const mainImage = property.imagenes[0];
  const detailPath = `/propiedades/${property.slug || property.remoteId || String(property.id)}`;
  const imageAlt = `${property.tipo} en ${property.ciudad}${property.barrio ? ` - ${property.barrio}` : ""}`;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-lg border-slate-200 bg-white/95 shadow-md transition hover:shadow-xl">
      <div
        className={`relative overflow-hidden ${
          compact ? "aspect-[16/9]" : "aspect-[16/9]"
        }`}
      >
        <Image
          src={mainImage}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/5 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-900 shadow-sm">
          {property.ciudad}
          {showNeighborhood && property.barrio ? ` • ${property.barrio}` : ""}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          {property.titulo}
        </h3>
        <p className="text-base font-semibold text-sky-700 sm:text-lg">
          {precioFormatted}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-slate-400" />
            <span>{property.habitaciones} hab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            <span>{property.banos} baños</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-slate-400" />
            <span>{property.metros} m²</span>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="mt-3 w-full bg-[#0A2540] text-xs font-semibold text-white hover:bg-[#103463]"
        >
          <Link href={detailPath}>Ver detalles</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

