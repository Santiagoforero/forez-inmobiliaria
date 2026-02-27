"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";

import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ciudades = ["Bucaramanga", "Bogotá", "Medellín", "Cali", "Cartagena"];

export default function PublicarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ciudad, setCiudad] = useState<string>("Bucaramanga");
  const [barrio, setBarrio] = useState("");
  const [tipo, setTipo] = useState<string>("Apartamento");
  const [habitaciones, setHabitaciones] = useState("3");
  const [banos, setBanos] = useState("2");
  const [metros, setMetros] = useState("100");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [tour360Url, setTour360Url] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [entorno, setEntorno] = useState("");
  const [entornoImages, setEntornoImages] = useState<string[]>([]);
  const [entornoDocs, setEntornoDocs] = useState<string[]>([]);
  const [entornoVideos, setEntornoVideos] = useState("");
  const [planosUrls, setPlanosUrls] = useState<string[]>([]);
  const [licenciaArchivos, setLicenciaArchivos] = useState<string[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugBase = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setError("Debes adjuntar al menos una imagen de la propiedad.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const slug = slugBase || `propiedad-${Date.now()}`;
      const payload = {
        slug,
        titulo,
        descripcionCorta: descripcion.slice(0, 200),
        descripcionLarga: descripcion,
        precio: Number(precio || 0),
        ciudad,
        tipo,
        barrio: barrio.trim() || "",
        metros: Number(metros || 0),
        habitaciones: Number(habitaciones || 0),
        banos: Number(banos || 0),
        images: imageUrls,
        tour360_url: tour360Url.trim() || null,
        video_url: videoUrl.trim() || null,
        entorno: entorno.trim() || null,
        entorno_imagenes: entornoImages,
        entorno_videos: entornoVideos
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
        entorno_archivos: entornoDocs,
        planos_urls: planosUrls,
        licencia_archivos: licenciaArchivos,
        lat: lat ?? 4.60971,
        lng: lng ?? -74.08175,
      };

      let insertedId: string | null = null;

      if (editId) {
        const { data, error: updateError } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editId)
          .select("id");
        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        insertedId = row?.id ?? editId;
      } else {
        const { data, error: insertError } = await supabase
          .from("properties")
          .insert(payload)
          .select("id");
        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        insertedId = row?.id ?? null;
      }

      if (insertedId) {
        router.push(`/propiedades/${insertedId}`);
      }
    } catch (e: unknown) {
      setError(typeof (e as Error)?.message === "string" ? (e as Error).message : "Error publicando propiedad.");
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
          .from("properties")
          .select(
            "titulo,descripcionCorta,descripcionLarga,precio,ciudad,tipo,barrio,metros,habitaciones,banos,images,tour360_url,video_url,entorno,entorno_imagenes,entorno_videos,entorno_archivos,planos_urls,licencia_archivos,lat,lng",
          )
          .eq("id", editId)
          .maybeSingle();
        if (error || !data) {
          setError(error?.message ?? "No se pudo cargar la propiedad para edición.");
          setLoading(false);
          return;
        }
        const row = data as any;
        setTitulo(row.titulo ?? "");
        setDescripcion(row.descripcionLarga ?? row.descripcionCorta ?? "");
        setPrecio(row.precio?.toString() ?? "");
        setCiudad(row.ciudad ?? "Bucaramanga");
        setTipo(row.tipo ?? "Apartamento");
        setBarrio(row.barrio ?? "");
        setMetros(row.metros?.toString() ?? "0");
        setHabitaciones(row.habitaciones?.toString() ?? "0");
        setBanos(row.banos?.toString() ?? "0");
        setImageUrls(Array.isArray(row.images) ? row.images : []);
        setTour360Url(row.tour360_url ?? "");
        setVideoUrl(row.video_url ?? "");
        setEntorno(row.entorno ?? "");
        setEntornoImages(row.entorno_imagenes ?? []);
        setEntornoVideos((row.entorno_videos ?? []).join("\n"));
        setEntornoDocs(row.entorno_archivos ?? []);
        setPlanosUrls(row.planos_urls ?? []);
        setLicenciaArchivos(row.licencia_archivos ?? []);
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
                  Publicar propiedad
                </p>
                <h1 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                  Detalles principales
                </h1>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Título
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
                  Descripción larga
                </label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  rows={5}
                  className="border-slate-300 bg-white text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Precio (COP)
                  </label>
                  <Input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Ciudad
                  </label>
                  <Select
                    value={ciudad}
                    onValueChange={(value) => setCiudad(value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Barrio
                  </label>
                  <Input
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Tipo
                  </label>
                  <Select
                    value={tipo}
                    onValueChange={(value) => setTipo(value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Bodega">Bodega</SelectItem>
                      <SelectItem value="Local comercial">Local comercial</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Lote">Lote</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Habitaciones
                  </label>
                  <Input
                    type="number"
                    value={habitaciones}
                    onChange={(e) => setHabitaciones(e.target.value)}
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Baños
                  </label>
                  <Input
                    type="number"
                    value={banos}
                    onChange={(e) => setBanos(e.target.value)}
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Metros (m²)
                  </label>
                  <Input
                    type="number"
                    value={metros}
                    onChange={(e) => setMetros(e.target.value)}
                    className="border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Imágenes (requerido al menos 1)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#0A2540] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#103463]"
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
                        const path = `props/${Date.now()}-${i}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("property-images")
                          .upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: urlData } = supabase.storage
                          .from("property-images")
                          .getPublicUrl(path);
                        urls.push(urlData.publicUrl);
                      }
                      setImageUrls((prev) => [...prev, ...urls]);
                    } catch (err: unknown) {
                      setError((err as Error)?.message ?? "Error subiendo imágenes. Verifica que el bucket exista.");
                    } finally {
                      setImageUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                {imageUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imageUrls.map((url, i) => (
                      <div key={url} className="relative h-16 w-24 overflow-hidden rounded border border-slate-200">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                          className="absolute right-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {imageUploading && <p className="text-[11px] text-slate-500">Subiendo...</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Tour 360° (opcional)
                </label>
                <input
                  id="tour360"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(true);
                    setError(null);
                    try {
                      const ext = file.name.split(".").pop() || "jpg";
                      const path = `tours/${Date.now()}.${ext}`;
                      const { error: upErr } = await supabase.storage
                        .from("property-images")
                        .upload(path, file, { upsert: true });
                      if (upErr) throw upErr;
                      const { data: urlData } = supabase.storage
                        .from("property-images")
                        .getPublicUrl(path);
                      setTour360Url(urlData.publicUrl);
                    } catch (err: unknown) {
                      setError(
                        (err as Error)?.message ??
                          "Error subiendo el tour 360°. Verifica que el bucket exista.",
                      );
                    } finally {
                      setImageUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="tour360" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    {tour360Url ? "Cambiar imagen 360°" : "Seleccionar imagen 360°"}
                  </label>
                  {tour360Url && (
                    <>
                      <span className="text-xs text-slate-600">1 archivo cargado</span>
                      <div className="relative inline-block h-14 w-20 overflow-hidden rounded border border-slate-200">
                        <img src={tour360Url} alt="Tour 360" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setTour360Url("")} className="absolute right-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Sube una imagen panorámica equirectangular (360°) compatible con el visor.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Video de YouTube (opcional)
                </label>
                <Input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  className="border-slate-300 bg-white text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Pega el enlace del video de la propiedad. Se mostrará en la ficha de detalles.
                </p>
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
                  placeholder="Centros comerciales cercanos, vías principales, transporte, servicios, equipamientos, etc."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Imágenes del entorno (opcional)
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
                          const path = `properties/entorno/images/${Date.now()}-${i}.${ext}`;
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entornoImages.map((url, i) => (
                        <div
                          key={url}
                          className="relative h-14 w-20 overflow-hidden rounded border border-slate-200"
                        >
                          <img src={url} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setEntornoImages((p) => p.filter((_, j) => j !== i))
                            }
                            className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
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
                          const path = `properties/entorno/docs/${Date.now()}-${i}.${ext}`;
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
                  Videos de referencia del sector (URLs, opcional)
                </label>
                <Textarea
                  rows={3}
                  value={entornoVideos}
                  onChange={(e) => setEntornoVideos(e.target.value)}
                  className="border-slate-300 bg-white text-xs sm:text-sm"
                  placeholder={"Pega aquí uno o varios enlaces (YouTube, Vimeo, etc.), uno por línea.\nEjemplo:\nhttps://www.youtube.com/watch?v=..."}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Planos y volumetría (opcional)
                  </label>
                  <input
                    id="planos-prop"
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
                          const path = `properties/planos/${Date.now()}-${i}.${ext}`;
                          const { error: upErr } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
                          if (upErr) throw upErr;
                          const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
                          urls.push(urlData.publicUrl);
                        }
                        setPlanosUrls((prev) => [...prev, ...urls]);
                      } catch (err: unknown) {
                        setError((err as Error)?.message ?? "Error subiendo planos.");
                      } finally {
                        setImageUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="planos-prop" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      {planosUrls.length > 0 ? "Agregar más" : "Seleccionar archivos"}
                    </label>
                    {planosUrls.length > 0 && <span className="text-xs text-slate-600">{planosUrls.length} archivo(s) cargado(s)</span>}
                  </div>
                  {planosUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {planosUrls.map((url, i) => (
                        <div key={url} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                          <span className="max-w-[100px] truncate text-[11px] text-slate-700">{url.split("/").pop() || `Plano ${i + 1}`}</span>
                          <button type="button" onClick={() => setPlanosUrls((p) => p.filter((_, j) => j !== i))} className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Licencia / documentación (opcional)
                  </label>
                  <input
                    id="licencia-prop"
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
                          const path = `properties/licencia/${Date.now()}-${i}.${ext}`;
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
                    <label htmlFor="licencia-prop" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      {licenciaArchivos.length > 0 ? "Agregar más" : "Seleccionar archivos"}
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
              </div>

              <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Ubicación aproximada
              </p>
              <p className="text-xs text-slate-600">
                Usa el mapa para seleccionar la ubicación aproximada de la propiedad. El pin se muestra en la ubicación seleccionada.
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
                  disabled={loading || imageUrls.length === 0 || imageUploading}
                  className="w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
                >
                  {loading ? "Publicando..." : "Publicar propiedad"}
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
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        containerRef.current = node ?? null;
        if (!node) return;
        if (mapRef.current) return;
        if (!mapboxgl.accessToken) return;

        const lat = initialLat != null ? Number(initialLat) : 4.60971;
        const lng = initialLng != null ? Number(initialLng) : -74.08175;
        const center: [number, number] = Number.isNaN(lng) || Number.isNaN(lat) ? [-74.08175, 4.60971] : [lng, lat];

        const m = new mapboxgl.Map({
          container: node,
          style: "mapbox://styles/mapbox/light-v11",
          center,
          zoom: 14,
        });
        mapRef.current = m;
        m.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

        if (initialLat != null && initialLng != null && !Number.isNaN(Number(initialLat)) && !Number.isNaN(Number(initialLng))) {
          const mk = new mapboxgl.Marker({ color: "#0A2540" })
            .setLngLat([Number(initialLng), Number(initialLat)])
            .addTo(m);
          markerRef.current = mk;
        }

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

