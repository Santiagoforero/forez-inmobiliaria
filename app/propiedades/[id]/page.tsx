import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import {
  getPropertyByIdentifierFromSupabase,
  getPropertiesFromSupabase,
} from "@/lib/supabase";
import type { Property } from "@/lib/properties";
import PropertyDetail from "@/components/PropertyDetail";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forez.co";
export const revalidate = 300;

type ParamsProps = {
  params: Promise<{ id: string }>;
};

function buildPropertySeoTitle(property: Property) {
  const tipo = property.tipo || "Propiedad";
  const ciudad = property.ciudad || "Colombia";
  const barrio = property.barrio || "Zona premium";
  return `${tipo} en ${ciudad} - ${barrio} | FOREZ`;
}

function buildPropertySeoText(property: Property) {
  const barrio = property.barrio || "sector estratégico";
  return `Esta ${property.tipo.toLowerCase()} ubicada en ${barrio}, ${property.ciudad}, representa una alternativa sólida para quienes buscan combinar calidad de vida y potencial de valorización. ${property.descripcionCorta || "Su configuración interior, distribución y contexto urbano la convierten en una opción atractiva para vivienda o inversión."} En FOREZ analizamos cada activo con una mirada integral: entorno inmediato, conectividad, dinámica comercial, perfil del sector y proyección de demanda en el mediano y largo plazo.

En términos de ubicación, ${barrio} se caracteriza por su acceso a servicios, comercios, centros educativos y corredores principales, factores que suelen impactar positivamente la liquidez del inmueble. Este tipo de propiedad en ${property.ciudad} mantiene interés constante en diferentes perfiles de comprador, desde familias que priorizan comodidad y cercanía, hasta inversionistas que buscan activos con buen comportamiento en ocupación y renta.

Desde la perspectiva de producto, el inmueble ofrece ${property.metros} m², ${property.habitaciones} habitaciones y ${property.banos} baños, una combinación que se adapta a necesidades actuales del mercado. Además, el análisis del entorno permite identificar ventajas competitivas frente a inmuebles similares en la zona: perfil residencial/comercial, evolución urbana y percepción de seguridad.

Si estás evaluando comprar en ${property.ciudad}, esta propiedad puede encajar en una estrategia patrimonial de largo plazo. En FOREZ te acompañamos con asesoría técnica y comercial para revisar comparables, validar precio por metro cuadrado, estimar costos de cierre y tomar una decisión informada con visión de valor real.`;
}

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id: identifier } = await params;
  const { property } = await getPropertyByIdentifierFromSupabase(identifier);

  if (!property) {
    return {
      title: "Propiedad no encontrada | Forez Inmobiliaria",
      description: "La propiedad que buscas no existe o fue eliminada.",
    };
  }

  const title = buildPropertySeoTitle(property);
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
      url: `${BASE_URL}/propiedades/${property.slug || identifier}`,
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
  const { id: identifier } = await params;
  const { property, matchedBy } = await getPropertyByIdentifierFromSupabase(identifier);

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

  if (matchedBy === "id" && property.slug && property.slug !== identifier) {
    permanentRedirect(`/propiedades/${property.slug}`);
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
  const seoText = buildPropertySeoText(property);
  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.titulo,
    description: property.descripcionCorta || property.descripcionLarga,
    url: `${BASE_URL}/propiedades/${property.slug || identifier}`,
    image: property.imagenes,
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: property.precio,
      availability: "https://schema.org/InStock",
    },
    itemOffered: {
      "@type": "Apartment",
      numberOfRooms: property.habitaciones,
      numberOfBathroomsTotal: property.banos,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.metros,
        unitCode: "MTK",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.ciudad,
      streetAddress: property.barrio || undefined,
      addressCountry: "CO",
    },
  };

  return (
    <>
      <PropertyDetail property={property} similares={similares} usdRate={usdRate} />
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Análisis del mercado en {property.ciudad}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
            {seoText}
          </p>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
    </>
  );
}
