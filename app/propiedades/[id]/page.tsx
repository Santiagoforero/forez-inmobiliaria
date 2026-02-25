import { getPropertyByIdFromSupabase, getPropertiesFromSupabase } from "@/lib/supabase";
import type { Property } from "@/lib/properties";
import PropertyDetail from "@/components/PropertyDetail";

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

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
