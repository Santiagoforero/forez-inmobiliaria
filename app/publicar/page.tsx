"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ciudad, setCiudad] = useState<string>("Bucaramanga");
  const [barrio, setBarrio] = useState("");
  const [tipo, setTipo] = useState<"Apartamento" | "Casa" | "Penthouse">(
    "Apartamento",
  );
  const [habitaciones, setHabitaciones] = useState("3");
  const [banos, setBanos] = useState("2");
  const [metros, setMetros] = useState("100");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
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

      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert({
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
          video_url: videoUrl.trim() || null,
          lat: lat ?? 4.60971,
          lng: lng ?? -74.08175,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      if (inserted?.id) {
        router.push(`/propiedades/${inserted.id}`);
      }
    } catch (e: unknown) {
      setError(typeof (e as Error)?.message === "string" ? (e as Error).message : "Error publicando propiedad.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/80">
          <CardContent className="grid grid-cols-1 gap-8 p-4 sm:p-8 sm:grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
                    onValueChange={(value: "Apartamento" | "Casa" | "Penthouse") =>
                      setTipo(value)
                    }
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
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

              {error && (
                <p className="text-xs font-semibold text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || imageUrls.length === 0 || imageUploading}
                className="mt-2 bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
              >
                {loading ? "Publicando..." : "Publicar propiedad"}
              </Button>
            </form>

            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Ubicación aproximada
              </p>
              <p className="text-xs text-slate-600">
                Usa el mapa para seleccionar la ubicación aproximada de la propiedad.
              </p>
              <MapPicker
                onChange={(latLng) => {
                  setLat(latLng.lat);
                  setLng(latLng.lng);
                }}
              />
              <p className="text-[11px] text-slate-500">
                Lat: {lat ?? "-"} / Lng: {lng ?? "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type LatLng = { lat: number; lng: number };

function MapPicker({ onChange }: { onChange: (v: LatLng) => void }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  if (typeof window !== "undefined" && !mapboxgl.accessToken) {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  }

  return (
    <div
      className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      ref={(node) => {
        if (!node) return;
        if (mapRef.current) return;
        if (!mapboxgl.accessToken) return;

        const m = new mapboxgl.Map({
          container: node,
          style: "mapbox://styles/mapbox/light-v11",
          center: [-74.08175, 4.60971],
          zoom: 4.5,
        });
        mapRef.current = m;
        m.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
        m.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          } else {
            const mk = new mapboxgl.Marker({ color: "#0A2540" })
              .setLngLat([lng, lat])
              .addTo(m);
            markerRef.current = mk;
          }
          onChange({ lat, lng });
        });
      }}
    />
  );
}

