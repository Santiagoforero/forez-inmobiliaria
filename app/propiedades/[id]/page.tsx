import type { Metadata } from "next";
import { getPropertyByIdFromSupabase, getPropertiesFromSupabase } from "@/lib/supabase";
import type { Property } from "@/lib/properties";
import PropertyDetail from "@/components/PropertyDetail";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forez.co";

type ParamsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyByIdFromSupabase(id);

  if (!property) {
    return {
      title: "Propiedad no encontrada | Forez Inmobiliaria",
      description: "La propiedad que buscas no existe o fue eliminada.",
    };
  }

  const title = `${property.titulo} | Forez Inmobiliaria`;
  const rawDesc =
    property.descripcionCorta || property.descripcionLarga || "Propiedad en Colombia gestionada por Forez Inmobiliaria.";
  const description =
    rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  const mainImage = property.imagenes?.[0];
  const imageUrl = mainImage?.startsWith("http")
    ? mainImage
    : `${BASE_URL}${mainImage || "/logo.png"}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/propiedades/${id}`,
      type: "article",
      locale: "es_CO",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

async function getUsdRate() {
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/COP",
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return 0;
    const json = (await res.json()) as { rates?: { USD?: number } };
    return json.rates?.USD ?? 0;
  } catch {
    return 0;
  }
}

export default async function PropertyPage({ params }: ParamsProps) {
  const { id } = await params;
  const property = await getPropertyByIdFromSupabase(id);

  if (!property) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Propiedad no encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">
          La propiedad que buscas no existe o fue eliminada.
        </p>
      </div>
    );
  }

  const allProperties = await getPropertiesFromSupabase();
  const similares = allProperties
    .filter((p) => {
      if (p.remoteId === property.remoteId) return false;
      if (p.ciudad === property.ciudad) return true;
      if (p.tipo === property.tipo) return true;
      const diff =
        Math.abs(p.precio - property.precio) /
        Math.max(property.precio, 1);
      return diff <= 0.18;
    })
    .slice(0, 4);

  const usdRate = await getUsdRate();

  return (
    <PropertyDetail
      property={property}
      similares={similares}
      usdRate={usdRate}
    />
  );
}
