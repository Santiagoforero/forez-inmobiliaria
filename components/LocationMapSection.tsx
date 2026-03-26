"use client";

type Props = {
  lat: number | null | undefined;
  lng: number | null | undefined;
  title?: string;
  subtitle?: string;
  onOpenInViewer?: (url: string) => void;
};

export function LocationMapSection({
  lat,
  lng,
  title = "Ubicación",
  subtitle = "Ubicación aproximada y contexto de la zona.",
  onOpenInViewer,
}: Props) {
  const hasCoords =
    lat != null &&
    lng != null &&
    !Number.isNaN(Number(lat)) &&
    !Number.isNaN(Number(lng));

  if (!hasCoords) {
    return (
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Este inmueble no tiene coordenadas publicadas por el momento.
          </p>
        </div>
      </section>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${Number(lat)},${Number(lng)}&output=embed`;

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6 space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <iframe
              src={mapUrl}
              title={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {onOpenInViewer && (
            <button
              type="button"
              onClick={() => onOpenInViewer(mapUrl)}
              className="text-sm font-semibold text-sky-700 hover:underline"
            >
              Ver mapa en grande
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
