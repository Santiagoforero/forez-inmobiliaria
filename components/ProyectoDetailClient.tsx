"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminEditProjectButton } from "@/components/AdminEditProjectButton";
import { EntornoPanel } from "@/components/EntornoPanel";
import type { MediaItem, MediaViewerType } from "@/components/MediaViewerModal";
import { MediaViewerModal } from "@/components/MediaViewerModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=0&mute=0` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}?autoplay=0&mute=0` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export type ProjectForDetail = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  estado: string;
  categoria: string;
  precio: number | null;
  fecha_entrega_estimada: string | null;
  images: string[];
  planos_urls: string[] | null;
  licencia_url: string | null;
  licencia_archivos: string[] | null;
  video_url: string | null;
  entorno: string | null;
  entorno_imagenes: string[] | null;
  entorno_videos: string[] | null;
  entorno_archivos: string[] | null;
  lat: number | null;
  lng: number | null;
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProyectoDetailClient({ project }: { project: ProjectForDetail }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<MediaItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState(
    `Estoy interesado en el proyecto "${project.titulo}" en ${project.ciudad}.`,
  );

  const openViewer = (items: MediaItem[], index: number) => {
    setViewerItems(items);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const planos = project.planos_urls ?? [];
  const licenciaUrls =
    Array.isArray(project.licencia_archivos) && project.licencia_archivos.length > 0
      ? project.licencia_archivos
      : project.licencia_url
        ? [project.licencia_url]
        : [];
  const additionalImages = project.images.slice(1);
  const videoEmbedUrl = project.video_url ? getYouTubeEmbedUrl(project.video_url) : null;

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        nombre: leadName || null,
        email: leadEmail || null,
        telefono: leadPhone || null,
        mensaje: leadMessage,
        propiedad_id: null,
        propiedad_titulo: `Proyecto: ${project.titulo}`,
      });
      if (error) {
        toast.error("No se pudo enviar tu solicitud. Intenta de nuevo.");
      } else {
        toast.success("Tu mensaje fue enviado. Un asesor te contactará pronto.");
        setLeadDialogOpen(false);
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
        setLeadMessage(
          `Estoy interesado en el proyecto "${project.titulo}" en ${project.ciudad}.`,
        );
      }
    } catch {
      toast.error("No se pudo enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setLeadLoading(false);
    }
  }

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
                Proyecto sobre planos
              </p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {project.titulo}
              </h1>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                {project.descripcion}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="rounded-full bg-slate-900/60 px-3 py-1 font-semibold text-slate-100">
                  {project.ciudad}
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300">
                  {project.estado}
                </span>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 font-semibold text-sky-300">
                  {project.categoria}
                </span>
                {project.fecha_entrega_estimada && (
                  <span className="rounded-full bg-slate-900/60 px-3 py-1 font-medium text-slate-200">
                    Entrega estimada{" "}
                    {new Date(project.fecha_entrega_estimada).toLocaleDateString("es-CO")}
                  </span>
                )}
              </div>
              {typeof project.precio === "number" && project.precio > 0 && (
                <p className="mt-4 text-lg font-semibold text-emerald-300 sm:text-xl">
                  Desde {formatCOP(project.precio)}
                </p>
              )}
              <div className="pt-2">
                <AdminEditProjectButton projectId={project.id} />
              </div>
            </div>

            <button
              type="button"
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 text-left shadow-2xl shadow-black/40 transition hover:ring-2 hover:ring-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onClick={() =>
                openViewer(
                  project.images.map((img, i) => ({
                    type: "image" as const,
                    url: img,
                    title: i === 0 ? project.titulo : `${project.titulo} — Render ${i + 1}`,
                  })),
                  0,
                )
              }
            >
              <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
              <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={project.titulo}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 pointer-events-none">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-black/40">
                    Renders oficiales
                  </span>
                  {planos.length > 0 && (
                    <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-slate-100 shadow-sm shadow-black/40">
                      {planos.length} plano(s) cargado(s)
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              {additionalImages.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Renders adicionales
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {additionalImages.slice(0, 6).map((img, idx) => (
                      <button
                        key={img + idx}
                        type="button"
                        className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        onClick={() =>
                          openViewer(
                            additionalImages.map((im, i) => ({
                              type: "image" as const,
                              url: im,
                              title: `${project.titulo} — Render ${i + 2}`,
                            })),
                            idx,
                          )
                        }
                      >
                        <Image
                          src={img}
                          alt={`${project.titulo} render ${idx + 2}`}
                          fill
                          sizes="(min-width: 1024px) 320px, 100vw"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Memoria del proyecto
                </p>
                <p className="mt-2 whitespace-pre-line">
                  {project.descripcion ||
                    "Próximamente publicaremos una memoria detallada del proyecto. Solicítala a nuestro equipo comercial si la necesitas de inmediato."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-700 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Ficha técnica rápida
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ciudad</span>
                    <span className="font-semibold text-slate-900">{project.ciudad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estado</span>
                    <span className="font-semibold text-slate-900">{project.estado}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Categoría</span>
                    <span className="font-semibold text-slate-900">{project.categoria}</span>
                  </div>
                  {typeof project.precio === "number" && project.precio > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Precio desde</span>
                      <span className="font-semibold text-slate-900">
                        {formatCOP(project.precio)}
                      </span>
                    </div>
                  )}
                  {project.fecha_entrega_estimada && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entrega estimada</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(
                          project.fecha_entrega_estimada,
                        ).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {videoEmbedUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
                  <p className="px-5 pt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Video del proyecto
                  </p>
                  <button
                    type="button"
                    className="relative block w-full aspect-video text-left transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    onClick={() => openViewer([{ type: "video" as const, url: videoEmbedUrl, title: "Video del proyecto" }], 0)}
                  >
                    <iframe
                      src={videoEmbedUrl}
                      title="Video del proyecto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </button>
                </div>
              )}

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Contacto e interés
                  </p>
                  <Dialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                      >
                        ESTOY INTERESADO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md border-slate-200 bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-slate-900">
                          Contactar sobre {project.titulo}
                        </DialogTitle>
                      </DialogHeader>
                      <form className="mt-4 space-y-3" onSubmit={handleLeadSubmit}>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Nombre completo
                          </label>
                          <Input
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            className="border-slate-300 bg-white"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Teléfono
                            </label>
                            <Input
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              className="border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Email
                            </label>
                            <Input
                              type="email"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Mensaje
                          </label>
                          <textarea
                            rows={4}
                            value={leadMessage}
                            onChange={(e) => setLeadMessage(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={leadLoading}
                          className="w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
                        >
                          {leadLoading ? "Enviando..." : "Enviar"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa contextual: ubicación del proyecto en Google Maps */}
      {project.lat != null &&
        project.lng != null &&
        !Number.isNaN(Number(project.lat)) &&
        !Number.isNaN(Number(project.lng)) && (
          <section className="bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Ubicación
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Ubicación de referencia del proyecto en el sector.
              </p>
              <div className="mt-6 space-y-2">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <iframe
                    src={`https://www.google.com/maps?q=${Number(project.lat)},${Number(project.lng)}&output=embed`}
                    title="Mapa de ubicación del proyecto"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openViewer(
                      [
                        {
                          type: "embed",
                          url: `https://www.google.com/maps?q=${Number(project.lat)},${Number(project.lng)}&output=embed`,
                          title: "Mapa de ubicación del proyecto",
                        },
                      ],
                      0,
                    )
                  }
                  className="text-sm font-semibold text-sky-700 hover:underline"
                >
                  Ver mapa en grande
                </button>
              </div>
            </div>
          </section>
        )}

      <section className="bg-slate-50">
        <EntornoPanel
          title="Análisis del entorno y documentación del proyecto"
          contextText={project.entorno}
          images={project.entorno_imagenes ?? []}
          videos={project.entorno_videos ?? []}
          documents={project.entorno_archivos ?? []}
          planos={planos}
          licenciaUrls={licenciaUrls}
          lat={project.lat ?? null}
          lng={project.lng ?? null}
        />
      </section>

      <MediaViewerModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={viewerItems}
        initialIndex={viewerIndex}
      />
    </div>
  );
}
