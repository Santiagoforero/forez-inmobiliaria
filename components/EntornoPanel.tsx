"use client";

import { useState } from "react";
import Image from "next/image";
import type { MediaItem, MediaViewerType } from "@/components/MediaViewerModal";
import { MediaViewerModal } from "@/components/MediaViewerModal";

function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0] || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export type EntornoPanelProps = {
  title?: string;
  contextText?: string | null;
  images?: string[];
  videos?: string[];
  documents?: string[];
  planos?: string[];
  licenciaUrls?: string[];
  lat?: number | null;
  lng?: number | null;
};

export function EntornoPanel({
  title = "Análisis del entorno y documentación",
  contextText,
  images = [],
  videos = [],
  documents = [],
  planos = [],
  licenciaUrls = [],
  lat,
  lng,
}: EntornoPanelProps) {
  const hasContext = contextText != null && String(contextText).trim().length > 0;
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const hasDocuments = documents.length > 0;
  const hasPlanos = planos.length > 0;
  const hasLicencias = licenciaUrls.length > 0;
  const hasMap = lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

  const hasAny =
    hasContext ||
    hasImages ||
    hasVideos ||
    hasDocuments ||
    hasPlanos ||
    hasLicencias ||
    hasMap;

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<MediaItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (items: MediaItem[], index: number) => {
    setViewerItems(items);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const videoEmbedUrls = videos
    .map((url) => {
      const ytId = getYouTubeVideoId(url);
      if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=0&mute=0`;
      return url;
    })
    .filter(Boolean);

  if (!hasAny) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      aria-labelledby="entorno-panel-title"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8 sm:py-6">
          <h2
            id="entorno-panel-title"
            className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Contexto del sector, documentación técnica y ubicación.
          </p>
        </div>

        <div className="space-y-0">
          {/* Contexto (texto) */}
          {hasContext && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Contexto
              </h3>
              <div className="mt-3 prose prose-slate max-w-none text-sm text-slate-700 prose-p:leading-relaxed">
                <p className="whitespace-pre-line">{contextText!.trim()}</p>
              </div>
            </div>
          )}

          {/* Galería del entorno */}
          {hasImages && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Galería del entorno
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() =>
                      openViewer(
                        images.map((u, i) => ({ type: "image" as const, url: u, title: `Entorno ${i + 1}` })),
                        idx,
                      )
                    }
                    className="relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <Image
                      src={src}
                      alt={`Entorno ${idx + 1}`}
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos (embebidos) */}
          {hasVideos && videoEmbedUrls.length > 0 && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Videos del entorno
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {videoEmbedUrls.map((embedUrl, i) => (
                  <button
                    key={`${embedUrl}-${i}`}
                    type="button"
                    onClick={() =>
                      openViewer(
                        videoEmbedUrls.map((u, j) => ({ type: "video" as const, url: u, title: `Video entorno ${j + 1}` })),
                        i,
                      )
                    }
                    className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-black text-left transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <iframe
                      src={embedUrl}
                      title={`Video entorno ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documentos técnicos (PDFs/imágenes embebidos) */}
          {hasDocuments && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Documentos técnicos
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Formatos de localización, análisis del sector y documentación relacionada.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {documents.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() =>
                      openViewer(
                        documents.map((u, j) => ({ type: "embed" as const, url: u, title: `Documento técnico ${j + 1}` })),
                        i,
                      )
                    }
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <iframe
                      src={url}
                      title={`Documento técnico ${i + 1}`}
                      className="pointer-events-none h-72 w-full bg-white sm:h-80"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Planos y volumetría */}
          {hasPlanos && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Planos y volumetría
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {planos.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() =>
                      openViewer(
                        planos.map((u, j) => ({ type: "embed" as const, url: u, title: `Plano ${j + 1}` })),
                        i,
                      )
                    }
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <iframe
                      src={url}
                      title={`Plano ${i + 1}`}
                      className="pointer-events-none h-72 w-full bg-white sm:h-80"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Licencias y documentación */}
          {hasLicencias && (
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Licencias y documentación
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {licenciaUrls.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() =>
                      openViewer(
                        licenciaUrls.map((u, j) => ({ type: "embed" as const, url: u, title: `Licencia / documentación ${j + 1}` })),
                        i,
                      )
                    }
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <iframe
                      src={url}
                      title={`Licencia / documentación ${i + 1}`}
                      className="pointer-events-none h-72 w-full bg-white sm:h-80"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mapa contextual */}
          {hasMap && (
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Mapa contextual
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Ubicación de referencia en el sector.
              </p>
              <button
                type="button"
                onClick={() =>
                  openViewer(
                    [
                      {
                        type: "embed",
                        url: `https://www.google.com/maps?q=${Number(lat)},${Number(lng)}&output=embed`,
                        title: "Mapa contextual del sector",
                      },
                    ],
                    0,
                  )
                }
                className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <iframe
                  src={`https://www.google.com/maps?q=${Number(lat)},${Number(lng)}&output=embed`}
                  title="Mapa contextual del sector"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      <MediaViewerModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={viewerItems}
        initialIndex={viewerIndex}
      />
    </section>
  );
}
