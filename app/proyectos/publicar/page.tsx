"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";

import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReorderableImagePreviews } from "@/components/FileUploadPreviews";
import { buildProjectSlug } from "@/lib/slug";

const CIUDAD_OTRO = "Otro";
const ciudades = [
  "Bucaramanga",
  "Bogotá",
  "Medellín",
  "Barranquilla",
  "Cali",
  "Floridablanca",
  "Piedecuesta",
  "Barichara",
  "Girón",
];

function PublicarProyectoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ciudad, setCiudad] = useState<string>(ciudades[0] ?? "Bucaramanga");
  const [ciudadLibre, setCiudadLibre] = useState("");
  const [estado, setEstado] = useState<string>("Preventa");
  const [categoria, setCategoria] = useState<string>("Residencial");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [renders, setRenders] = useState<string[]>([]);
  const [planos, setPlanos] = useState<string[]>([]);
  const [licenciaArchivos, setLicenciaArchivos] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entorno, setEntorno] = useState("");
  const [entornoImages, setEntornoImages] = useState<string[]>([]);
  const [entornoDocs, setEntornoDocs] = useState<string[]>([]);
  const [entornoVideos, setEntornoVideos] = useState("");

  const slugBase = buildProjectSlug({ titulo, ciudad, tipo: categoria });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (renders.length === 0) {
      setError("Debes adjuntar al menos un render del proyecto.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const slug = slugBase || `proyecto-${Date.now()}`;

      const numericPrecio = Number(String(precio).replace(/\D/g, "")) || null;

      const finalCiudad =
        ciudad === CIUDAD_OTRO ? ciudadLibre.trim() : ciudad;

      if (ciudad === CIUDAD_OTRO && !finalCiudad) {
        setError("Por favor escribe la ciudad si seleccionas 'Otro'.");
        setLoading(false);
        return;
      }

      const payload = {
        slug,
        titulo,
        descripcion,
        precio: numericPrecio,
        ciudad: finalCiudad,
        estado,
        categoria,
        fecha_entrega_estimada: fechaEntrega || null,
        images: renders,
        planos_urls: planos,
        licencia_archivos: licenciaArchivos,
        video_url: videoUrl.trim() || null,
        entorno: entorno.trim() || null,
        entorno_imagenes: entornoImages,
        entorno_videos: entornoVideos
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
        entorno_archivos: entornoDocs,
        lat: lat ?? null,
        lng: lng ?? null,
      };

      let projectId: string | null = null;

      if (editId) {
        const { data, error: updateError } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editId)
          .select("id");
        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        projectId = row?.id ?? editId;
      } else {
        const { data, error: insertError } = await supabase
          .from("projects")
          .insert(payload)
          .select("id");
        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        projectId = row?.id ?? null;
      }

      if (projectId) {
        router.push(`/proyectos/${slug}`);
      } else {
        router.push("/proyectos");
      }
    } catch (e: unknown) {
      setError(
        typeof (e as Error)?.message === "string"
          ? (e as Error).message
          : "Error publicando proyecto.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!editId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            "slug,titulo,descripcion,precio,video_url,ciudad,estado,categoria,fecha_entrega_estimada,images,planos_urls,licencia_url,licencia_archivos,entorno,entorno_imagenes,entorno_videos,entorno_archivos,lat,lng",
          )
          .eq("id", editId)
          .maybeSingle();
        if (error || !data) {
          setError(error?.message ?? "No se pudo cargar el proyecto para edición.");
          setLoading(false);
          return;
        }
        const row = data as any;
        setTitulo(row.titulo ?? "");
        setDescripcion(row.descripcion ?? "");
        setPrecio(
          row.precio != null
            ? String(row.precio).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            : "",
        );
        setVideoUrl(row.video_url ?? "");
        const rawCiudad = row.ciudad ?? "";
        if (ciudades.includes(rawCiudad)) {
          setCiudad(rawCiudad);
          setCiudadLibre("");
        } else if (rawCiudad) {
          setCiudad(CIUDAD_OTRO);
          setCiudadLibre(rawCiudad);
        } else {
          setCiudad(ciudades[0] ?? "Bucaramanga");
          setCiudadLibre("");
        }
        setEstado(row.estado ?? "Preventa");
        setCategoria(row.categoria ?? "Residencial");
        setFechaEntrega(row.fecha_entrega_estimada ?? "");
        setRenders(Array.isArray(row.images) ? row.images : []);
        setPlanos(row.planos_urls ?? []);
        setLicenciaArchivos(Array.isArray(row.licencia_archivos) ? row.licencia_archivos : (row.licencia_url ? [row.licencia_url] : []));
        setEntorno(row.entorno ?? "");
        setEntornoImages(row.entorno_imagenes ?? []);
        setEntornoVideos((row.entorno_videos ?? []).join("\n"));
        setEntornoDocs(row.entorno_archivos ?? []);
        setLat(row.lat != null ? Number(row.lat) : null);
        setLng(row.lng != null ? Number(row.lng) : null);
      } finally {
        setLoading(false);
      }
    })();
  }, [editId]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/80">
          <CardContent className="p-4 sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            >
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  Publicar proyecto
                </p>
                <h1 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                  Detalles del proyecto
                </h1>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Nombre del proyecto
                </label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="border-slate-300 bg-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Descripción comercial
                </label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  rows={6}
                  className="border-slate-300 bg-white text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Ciudad
                  </label>
                  <Select value={ciudad} onValueChange={(value) => setCiudad(value)}>
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value={CIUDAD_OTRO}>{CIUDAD_OTRO}</SelectItem>
                    </SelectContent>
                  </Select>
                  {ciudad === CIUDAD_OTRO && (
                    <div className="mt-2 space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">
                        Ciudad (escribe)
                      </label>
                      <Input
                        value={ciudadLibre}
                        onChange={(e) => setCiudadLibre(e.target.value)}
                        placeholder="Ej: Bucaramanga"
                        className="border-slate-300 bg-white text-sm"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Estado del proyecto
                  </label>
                  <Select value={estado} onValueChange={(value) => setEstado(value)}>
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventa">Preventa</SelectItem>
                      <SelectItem value="En construcción">En construcción</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Precio desde (COP)
                  </label>
                  <Input
                    value={precio}
                    onChange={(e) =>
                      setPrecio(
                        e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                      )
                    }
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Video de presentación (YouTube)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="border-slate-300 bg-white text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Categoría
                  </label>
                  <Select
                    value={categoria}
                    onValueChange={(value) => setCategoria(value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residencial">Residencial</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Fecha estimada de entrega
                  </label>
                  <Input
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Renders del proyecto (mínimo 1)
                </label>
                <input
                  id="renders-proj"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setImageUploading(true);
                    setError(null);
                    try {
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const ext = file.name.split(".").pop() || "jpg";
                        const path = `projects/renders/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("property-images")
                          .upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage
                          .from("property-images")
                          .getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setRenders((prev) => [...prev, ...urls]);
                    } catch (err: unknown) {
                      setError(
                        (err as Error)?.message ??
                          "Error subiendo renders. Verifica que el bucket exista.",
                      );
                    } finally {
                      setImageUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="renders-proj" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    {renders.length > 0 ? "Agregar más" : "Seleccionar renders"}
                  </label>
                  {renders.length > 0 && <span className="text-xs text-slate-600">{renders.length} render(es) cargado(s)</span>}
                </div>
                {renders.length > 0 && (
                  <div className="mt-2">
                    <ReorderableImagePreviews
                      urls={renders}
                      onRemove={(index) =>
                        setRenders((p) => p.filter((_, j) => j !== index))
                      }
                      onMove={(from, to) =>
                        setRenders((prev) => {
                          const next = [...prev];
                          const [item] = next.splice(from, 1);
                          next.splice(to, 0, item);
                          return next;
                        })
                      }
                    />
                    <p className="mt-2 text-[11px] text-slate-500">
                      Arrastra los renders para reordenarlos. El primero queda como principal.
                    </p>
                  </div>
                )}
                {imageUploading && <p className="text-[11px] text-slate-500">Subiendo...</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Planos y volumetría del proyecto (imágenes o PDFs, opcional)
                </label>
                <input
                  id="planos-proj"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setImageUploading(true);
                    setError(null);
                    try {
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const ext = file.name.split(".").pop() || "dat";
                        const path = `projects/planos/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("property-images")
                          .upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage
                          .from("property-images")
                          .getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setPlanos((prev) => [...prev, ...urls]);
                    } catch (err: unknown) {
                      setError(
                        (err as Error)?.message ??
                          "Error subiendo planos. Verifica que el bucket exista.",
                      );
                    } finally {
                      setImageUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="planos-proj" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    {planos.length > 0 ? "Agregar más" : "Seleccionar archivos"}
                  </label>
                  {planos.length > 0 && <span className="text-xs text-slate-600">{planos.length} archivo(s) cargado(s)</span>}
                </div>
                {planos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {planos.map((url, i) => {
                      const isImg = /\.(jpe?g|png|webp|gif)$/i.test(url);
                      return (
                        <div key={`${url}-${i}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                          {isImg ? (
                            <div className="relative h-12 w-16 overflow-hidden rounded">
                              <img src={url} alt="" className="h-full w-full object-cover" />
                              <button type="button" onClick={() => setPlanos((p) => p.filter((_, j) => j !== i))} className="absolute -right-1 -top-1 rounded bg-red-500 px-1 py-0.5 text-[10px] font-bold text-white">×</button>
                            </div>
                          ) : (
                            <>
                              <span className="max-w-[80px] truncate text-[11px] text-slate-700">{url.split("/").pop() || `Plano ${i + 1}`}</span>
                              <button type="button" onClick={() => setPlanos((p) => p.filter((_, j) => j !== i))} className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Caracterización de la zona (texto, opcional)
                </label>
                <Textarea
                  rows={4}
                  value={entorno}
                  onChange={(e) => setEntorno(e.target.value)}
                  className="border-slate-300 bg-white text-xs sm:text-sm"
                  placeholder="Centros comerciales cercanos, accesos viales, transporte, usos vecinos, equipamientos urbanos, etc."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Imágenes del entorno urbano (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      setImageUploading(true);
                      setError(null);
                    try {
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const ext = file.name.split(".").pop() || "jpg";
                        const path = `projects/entorno/images/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("property-images")
                          .upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage
                          .from("property-images")
                          .getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setEntornoImages((prev) => [...prev, ...urls]);
                      } catch (err: unknown) {
                        setError(
                          (err as Error)?.message ??
                            "Error subiendo imágenes de entorno. Verifica que el bucket entorno-assets exista.",
                        );
                      } finally {
                        setImageUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                  {entornoImages.length > 0 && (
                    <>
                      <p className="mt-2 text-xs text-slate-600">{entornoImages.length} imagen(es) de entorno cargada(s)</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entornoImages.map((url, i) => (
                          <div key={`${url}-${i}`} className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => setEntornoImages((p) => p.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Documentos del sector (PDF u otros, opcional)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    multiple
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      setImageUploading(true);
                      setError(null);
                    try {
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const ext = file.name.split(".").pop() || "dat";
                        const path = `projects/entorno/docs/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("property-images")
                          .upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage
                          .from("property-images")
                          .getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setEntornoDocs((prev) => [...prev, ...urls]);
                      } catch (err: unknown) {
                        setError(
                          (err as Error)?.message ??
                            "Error subiendo documentos de entorno. Verifica que el bucket entorno-assets exista.",
                        );
                      } finally {
                        setImageUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                  {entornoDocs.length > 0 && (
                    <>
                      <p className="mt-2 text-xs text-slate-600">{entornoDocs.length} documento(s) del sector cargado(s)</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entornoDocs.map((url, i) => (
                          <div key={url} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                            <span className="max-w-[100px] truncate text-[11px] text-slate-700">{url.split("/").pop() || `Doc ${i + 1}`}</span>
                            <button type="button" onClick={() => setEntornoDocs((p) => p.filter((_, j) => j !== i))} className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Videos del entorno (URLs, opcional)
                </label>
                <Textarea
                  rows={3}
                  value={entornoVideos}
                  onChange={(e) => setEntornoVideos(e.target.value)}
                  className="border-slate-300 bg-white text-xs sm:text-sm"
                  placeholder={"Pega aquí uno o varios enlaces (YouTube, Vimeo, etc.), uno por línea.\nEjemplo:\nhttps://www.youtube.com/watch?v=..."}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Licencia / documentación (opcional)
                </label>
                <input
                  id="licencia-proj"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setImageUploading(true);
                    setError(null);
                    try {
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const ext = file.name.split(".").pop() || "dat";
                        const path = `projects/licencia/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setLicenciaArchivos((prev) => [...prev, ...urls]);
                    } catch (err: unknown) {
                      setError((err as Error)?.message ?? "Error subiendo documentos.");
                    } finally {
                      setImageUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="licencia-proj" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    {licenciaArchivos.length > 0 ? "Agregar más" : "Adjuntar documento(s)"}
                  </label>
                  {licenciaArchivos.length > 0 && <span className="text-xs text-slate-600">{licenciaArchivos.length} archivo(s) cargado(s)</span>}
                </div>
                {licenciaArchivos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {licenciaArchivos.map((url, i) => (
                      <div key={url} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <span className="max-w-[100px] truncate text-[11px] text-slate-700">{url.split("/").pop() || `Doc ${i + 1}`}</span>
                        <button type="button" onClick={() => setLicenciaArchivos((p) => p.filter((_, j) => j !== i))} className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Ubicación de referencia
              </p>
              <p className="text-xs text-slate-600">
                Usa el mapa para marcar la ubicación. El pin se muestra en la ubicación seleccionada.
              </p>
              <MapPicker
                initialLat={lat}
                initialLng={lng}
                onChange={(latLng) => {
                  setLat(latLng.lat);
                  setLng(latLng.lng);
                }}
              />
              <p className="text-[11px] text-slate-500">
                Lat: {lat ?? "-"} / Lng: {lng ?? "-"}
              </p>
              <div className="pt-4">
                {error && (
                  <p className="mb-2 text-xs font-semibold text-red-600">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={loading || imageUploading || renders.length === 0}
                  className="w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
                >
                  {loading ? "Publicando..." : "Publicar proyecto"}
                </Button>
              </div>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type LatLng = { lat: number; lng: number };

function MapPicker({
  initialLat,
  initialLng,
  onChange,
}: {
  initialLat?: number | null;
  initialLng?: number | null;
  onChange: (v: LatLng) => void;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  if (typeof window !== "undefined" && !mapboxgl.accessToken) {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const lat = initialLat != null ? Number(initialLat) : null;
    const lng = initialLng != null ? Number(initialLng) : null;
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return;

    map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 14) });
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      const mk = new mapboxgl.Marker({ color: "#0A2540" })
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = mk;
    }
  }, [initialLat, initialLng]);

  return (
    <div
      className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      ref={(node) => {
        if (!node) return;
        if (mapRef.current) return;
        if (!mapboxgl.accessToken) return;

        const DEFAULT_LAT = 7.1250; // Bucaramanga
        const DEFAULT_LNG = -73.1190; // Bucaramanga
        const resolvedLat = initialLat != null ? Number(initialLat) : DEFAULT_LAT;
        const resolvedLng = initialLng != null ? Number(initialLng) : DEFAULT_LNG;
        const center: [number, number] = [
          Number.isNaN(resolvedLng) ? DEFAULT_LNG : resolvedLng,
          Number.isNaN(resolvedLat) ? DEFAULT_LAT : resolvedLat,
        ];

        const m = new mapboxgl.Map({
          container: node,
          style: "mapbox://styles/mapbox/light-v11",
          center,
          zoom: 14,
        });
        mapRef.current = m;
        m.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

        // Mostrar marcador en la ubicación inicial (o Bucaramanga si no hay coords)
        const latForMarker = Number.isNaN(resolvedLat) ? DEFAULT_LAT : resolvedLat;
        const lngForMarker = Number.isNaN(resolvedLng) ? DEFAULT_LNG : resolvedLng;
        const mk = new mapboxgl.Marker({ color: "#0A2540" })
          .setLngLat([lngForMarker, latForMarker])
          .addTo(m);
        markerRef.current = mk;

        m.on("click", (e) => {
          const { lng: lngClick, lat: latClick } = e.lngLat;
          if (markerRef.current) {
            markerRef.current.setLngLat([lngClick, latClick]);
          } else {
            const mk = new mapboxgl.Marker({ color: "#0A2540" })
              .setLngLat([lngClick, latClick])
              .addTo(m);
            markerRef.current = mk;
          }
          onChange({ lat: latClick, lng: lngClick });
        });
      }}
    />
  );
}

export default function PublicarProyectoPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-slate-500">Cargando...</div>}>
      <PublicarProyectoForm />
    </Suspense>
  );
}

