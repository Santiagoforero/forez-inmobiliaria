"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  MapPin,
  Play,
  Ruler,
  Sparkles,
} from "lucide-react";

import type { Property } from "@/lib/properties";
import { EntornoPanel } from "@/components/EntornoPanel";
import type { MediaItem, MediaViewerType } from "@/components/MediaViewerModal";
import { MediaViewerModal } from "@/components/MediaViewerModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import "pannellum/build/pannellum.css";

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

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PropertyDetail({
  property,
  similares,
  usdRate,
}: {
  property: Property;
  similares: Property[];
  usdRate?: number;
}) {
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [staged, setStaged] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState(
    `Estoy interesado en la propiedad "${property.titulo}" en ${property.ciudad}.`,
  );
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerItems, setMediaViewerItems] = useState<MediaItem[]>([]);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);

  const openMediaViewer = (items: MediaItem[], index: number) => {
    setMediaViewerItems(items);
    setMediaViewerIndex(index);
    setMediaViewerOpen(true);
  };

  const images = staged ? property.imagenesStaging : property.imagenes;
  const thumbs = images.slice(0, Math.max(6, Math.min(images.length, 12)));
  const activeImage = thumbs[Math.min(activeIdx, thumbs.length - 1)] ?? images[0];

  const chips = useMemo(
    () => [
      { Icon: BedDouble, value: `${property.habitaciones} hab` },
      { Icon: Bath, value: `${property.banos} baños` },
      { Icon: Ruler, value: `${property.metros} m²` },
      {
        Icon: MapPin,
        value: `${property.ciudad}${property.barrio ? ` • ${property.barrio}` : ""}`,
      },
    ],
    [property],
  );

  const usdApprox =
    usdRate && usdRate > 0 ? Math.round(property.precio * usdRate) : null;

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.user?.email === "forezinmobiliaria@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        nombre: leadName || null,
        email: leadEmail || null,
        telefono: leadPhone || null,
        mensaje: leadMessage,
        propiedad_id: property.remoteId ?? null,
        propiedad_titulo: property.titulo,
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
          `Estoy interesado en la propiedad "${property.titulo}" en ${property.ciudad}.`,
        );
      }
    } catch {
      toast.error("No se pudo enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setLeadLoading(false);
    }
  }

  async function handleDeleteProperty() {
    if (!property.remoteId) return;
    const confirm = window.confirm(
      `¿Seguro que deseas eliminar la propiedad "${property.titulo}"? Esta acción no se puede deshacer.`,
    );
    if (!confirm) return;
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.remoteId);
      if (error) {
        toast.error("No se pudo eliminar la propiedad. Intenta de nuevo.");
        return;
      }
      toast.success("Propiedad eliminada correctamente.");
      router.push("/propiedades");
    } catch {
      toast.error("No se pudo eliminar la propiedad. Intenta de nuevo.");
    }
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-slate-300 text-slate-700">
                  {property.tipo}
                </Badge>
                <Badge variant="secondary" className="bg-sky-50 text-sky-700">
                  {property.ciudad}
                </Badge>
                {property.barrio && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {property.barrio}
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-5xl">
                {property.titulo}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                {property.descripcionCorta}
              </p>
            </div>
            <div className="space-y-2 text-left lg:text-right">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Precio estimado
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {formatCOP(property.precio)}
              </p>
              {usdApprox && (
                <p className="text-xs text-slate-500">
                  ≈{" "}
                  <span className="font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(usdApprox)}
                  </span>{" "}
                  USD (tasa diaria)
                </p>
              )}
              {isAdmin && property.remoteId && (
                <div className="space-y-1.5">
                  <Button
                    asChild
                    variant="outline"
                    className="mt-2 border-sky-500 text-[11px] font-semibold text-sky-800 hover:bg-sky-50"
                  >
                    <Link href={`/publicar?edit=${property.remoteId}`}>
                      Editar esta propiedad
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeleteProperty}
                    className="border-red-500 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    Eliminar propiedad
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
                <div
                  className="relative aspect-video overflow-hidden cursor-pointer"
                  onClick={() =>
                    openMediaViewer(
                      images.map((img, i) => ({ type: "image" as const, url: img, title: `${property.titulo} — Imagen ${i + 1}` })),
                      activeIdx,
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openMediaViewer(images.map((img, i) => ({ type: "image" as const, url: img, title: `${property.titulo} — Imagen ${i + 1}` })), activeIdx)}
                  aria-label="Ver imagen en grande"
                >
                  <Image
                    src={activeImage}
                    alt={property.titulo}
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 bg-white/90 text-xs font-semibold text-slate-900 hover:bg-white"
                      onClick={() => setGalleryOpen(true)}
                    >
                      Ver galería
                    </Button>
                    {property.imagenesStaging?.length > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 bg-white/90 text-xs font-semibold text-slate-900 hover:bg-white"
                        onClick={() => setStaged((v) => !v)}
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-sky-700" />
                        {staged ? "Ver real" : "Ver amueblado"}
                      </Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {thumbs.map((img, idx) => (
                      <button
                        key={img + idx}
                        className={`relative h-20 w-32 flex-none overflow-hidden rounded-xl border ${
                          idx === activeIdx ? "border-sky-400" : "border-slate-200"
                        }`}
                        onClick={() => {
                          setActiveIdx(idx);
                          openMediaViewer(
                            thumbs.map((im, i) => ({ type: "image" as const, url: im, title: `${property.titulo} — Imagen ${i + 1}` })),
                            idx,
                          );
                        }}
                        aria-label={`Imagen ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${property.titulo} miniatura ${idx + 1}`}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Detalles
                    </p>
                    <div className="mt-4 grid gap-2 text-xs text-slate-600">
                      {chips.map(({ Icon, value }) => (
                        <div key={value} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Acciones
                    </p>
                    <Button
                      className="w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
                      onClick={() => setTourOpen(true)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Tour Virtual 360°
                    </Button>

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
                            Contactar sobre {property.titulo}
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
              <CostosCompra valor={property.precio} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
              className="space-y-4"
            >
              {property.videoUrl && (() => {
                const videoId = getYouTubeVideoId(property.videoUrl);
                if (!videoId) return null;
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
                return (
                  <Card className="overflow-hidden border-slate-200 bg-black">
                    <CardContent className="p-0">
                      <p className="px-5 pt-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        Video de la propiedad
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          openMediaViewer(
                            [{ type: "video" as const, url: embedUrl, title: "Video de la propiedad" }],
                            0,
                          )
                        }
                        className="relative block aspect-video w-full text-left transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                          title="Video de la propiedad"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="pointer-events-none absolute inset-0 h-full w-full"
                        />
                      </button>
                    </CardContent>
                  </Card>
                );
              })()}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Descripción
                  </p>
                  <p className="text-sm text-slate-700">{property.descripcionLarga}</p>

                  <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tipo</span>
                      <span className="font-semibold text-slate-900">{property.tipo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Ciudad</span>
                      <span className="font-semibold text-slate-900">{property.ciudad}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Área</span>
                      <span className="font-semibold text-slate-900">{property.metros} m²</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full border-slate-300 bg-white hover:bg-slate-50">
                    <Link href="/propiedades">Volver al portafolio</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <EntornoPanel
        title="Análisis del entorno y documentación"
        contextText={property.entorno}
        images={property.entornoImagenes ?? []}
        videos={property.entornoVideos ?? []}
        documents={property.entornoArchivos ?? []}
        planos={property.planosUrls ?? []}
        licenciaUrls={property.licenciaArchivos ?? []}
        lat={property.coords?.lat}
        lng={property.coords?.lng}
      />

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Ubicación
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ubicación aproximada y contexto de la zona.
          </p>
          <div className="mt-6 space-y-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <iframe
                src={`https://www.google.com/maps?q=${property.coords.lat},${property.coords.lng}&output=embed`}
                title="Mapa de ubicación"
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                openMediaViewer(
                  [
                    {
                      type: "embed",
                      url: `https://www.google.com/maps?q=${property.coords.lat},${property.coords.lng}&output=embed`,
                      title: "Mapa de ubicación",
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

      {similares.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Propiedades similares
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {similares.map((p) => (
                <Card
                  key={p.id}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border-slate-200 bg-white shadow-md transition hover:shadow-xl"
                >
                  <button
                    type="button"
                    className="relative aspect-video overflow-hidden text-left transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    onClick={() =>
                      openMediaViewer(
                        [{ type: "image" as const, url: p.imagenes[0], title: p.titulo }],
                        0,
                      )
                    }
                  >
                    <Image
                      src={p.imagenes[0]}
                      alt={p.titulo}
                      fill
                      sizes="(min-width: 1280px) 320px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                  <CardContent className="space-y-2 p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {p.titulo}
                    </p>
                    <p className="text-xs font-semibold text-sky-700">
                      {formatCOP(p.precio)}
                    </p>
                    <Link
                      href={`/propiedades/${p.remoteId ?? String(p.id)}`}
                      className="text-xs font-semibold text-[#0A2540] hover:underline"
                    >
                      Ver detalles
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {property.imagenes360?.length > 0 && (
        <Tour360Dialog
          open={tourOpen}
          onOpenChange={setTourOpen}
          imageUrl={property.imagenes360[0]}
        />
      )}

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto border-slate-200 bg-white p-0 sm:max-w-2xl lg:max-w-6xl">
          <DialogHeader className="px-4 py-3">
            <DialogTitle className="text-sm font-semibold text-slate-900">
              Galería
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(0, 12).map((img, idx) => (
              <button
                key={img + idx}
                className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 transition hover:ring-2 hover:ring-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                onClick={() => {
                  setActiveIdx(idx);
                  setGalleryOpen(false);
                  openMediaViewer(
                    images.map((im, i) => ({ type: "image" as const, url: im, title: `${property.titulo} — Imagen ${i + 1}` })),
                    idx,
                  );
                }}
              >
                <Image
                  src={img}
                  alt={`${property.titulo} ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <MediaViewerModal
        open={mediaViewerOpen}
        onOpenChange={setMediaViewerOpen}
        items={mediaViewerItems}
        initialIndex={mediaViewerIndex}
      />
    </div>
  );
}

function Tour360Dialog({
  open,
  onOpenChange,
  imageUrl,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  imageUrl?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  const src = imageUrl || "";

  useEffect(() => {
    if (!open) return;
    if (!containerRef.current) return;

    let cancelled = false;
    setError(null);

    if (!imageUrl) {
      setError(
        "Próximamente subiremos el tour 360° de esta propiedad. Solicítalo a uno de nuestros asesores si lo necesitas.",
      );
      return;
    }

    (async () => {
      try {
        const pannellum = (await import("pannellum")) as any;
        if (cancelled) return;
        if (!containerRef.current) return;

        viewerRef.current = pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: src,
          autoLoad: true,
          showControls: true,
          hfov: 105,
        });
      } catch (e: any) {
        setError(typeof e?.message === "string" ? e.message : "Error cargando el tour 360°.");
      }
    })();

    return () => {
      cancelled = true;
      try {
        viewerRef.current?.destroy?.();
      } catch {
        // ignore
      } finally {
        viewerRef.current = null;
      }
    };
  }, [open, src]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-hidden border-slate-200 bg-black p-0 sm:max-w-2xl lg:max-w-6xl">
        <DialogHeader className="px-4 py-3">
          <DialogTitle className="text-sm font-semibold text-white">
            Tour Virtual 360°
          </DialogTitle>
        </DialogHeader>
        <div className="relative h-[50vh] w-full min-h-[280px] bg-black sm:h-[60vh] lg:h-[74vh]">
          {error ? (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <p className="text-sm font-semibold text-white">{error}</p>
            </div>
          ) : (
            <div ref={containerRef} className="h-full w-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CostosCompra({ valor }: { valor: number }) {
  const tasaValorizacion = 0.05;
  const valor5Anos = Math.round(valor * Math.pow(1 + tasaValorizacion, 5));
  const valor10Anos = Math.round(valor * Math.pow(1 + tasaValorizacion, 10));
  const notaria = Math.round(valor * 0.01);
  const registro = Math.round(valor * 0.005);
  const totalInversion = valor + notaria + registro;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-br from-[#0A2540] to-[#103463] px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight text-white">
          Tu inversión en números
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          Proyección y costos estimados para tomar la mejor decisión
        </p>
        <p className="mt-1 text-[10px] text-slate-300/80">
          Estas son proyecciones de referencia; el comportamiento real puede variar según mercado, tasas, regulaciones y otros factores.
        </p>
      </div>
      <CardContent className="space-y-5 p-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Proyección de valor
          </p>
          <p className="text-xs text-slate-600">
            Con una valorización histórica promedio del 5% anual en zonas premium.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">En 5 años</p>
              <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg">{formatCOP(valor5Anos)}</p>
              <p className="text-[11px] text-emerald-600">+{formatCOP(valor5Anos - valor)} estimado</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">En 10 años</p>
              <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg">{formatCOP(valor10Anos)}</p>
              <p className="text-[11px] text-emerald-600">+{formatCOP(valor10Anos - valor)} estimado</p>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Inversión total aproximada
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Precio de venta</span>
              <span className="font-semibold">{formatCOP(valor)}</span>
            </div>
            <div className="flex justify-between">
              <span>Notaría + registro</span>
              <span>{formatCOP(notaria + registro)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>Total a invertir</span>
              <span className="text-[#0A2540]">{formatCOP(totalInversion)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-900">
            ¿Por qué comprar con Forez?
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] text-emerald-800">
            <li>• Asesoría personalizada en todo el proceso</li>
            <li>• Acompañamiento en trámites legales</li>
            <li>• Curaduría de propiedades verificadas</li>
            <li>• Más de 150 familias ya confiaron en nosotros</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}


