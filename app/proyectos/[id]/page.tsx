import { supabase } from "@/lib/supabase";
import { ProyectoDetailClient } from "@/components/ProyectoDetailClient";

type ProjectRow = {
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

async function fetchProjectById(id: string): Promise<ProjectRow | null> {
  // Intento 1: con todas las columnas “nuevas”
  const fullSelect =
    "id, slug, titulo, descripcion, ciudad, estado, categoria, precio, fecha_entrega_estimada, images, planos_urls, licencia_url, licencia_archivos, video_url, entorno, entorno_imagenes, entorno_videos, entorno_archivos, lat, lng";

  const { data, error } = await supabase
    .from("projects")
    .select(fullSelect)
    .eq("id", id)
    .maybeSingle<ProjectRow>();

  if (!error) return data ?? null;

  // Si el error es por columna inexistente (migración no aplicada), reintenta con un SELECT mínimo.
  const msg = (error as any)?.message as string | undefined;
  if (msg && msg.toLowerCase().includes("column") && msg.toLowerCase().includes("does not exist")) {
    const minimalSelect =
      "id, slug, titulo, descripcion, ciudad, estado, categoria, precio, fecha_entrega_estimada, images, planos_urls, licencia_url, video_url, lat, lng";
    const retry = await supabase
      .from("projects")
      .select(minimalSelect)
      .eq("id", id)
      .maybeSingle<ProjectRow>();
    if (retry.error) return null;
    return retry.data ?? null;
  }

  return null;
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await fetchProjectById(id);

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Proyecto no encontrado
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          El proyecto que buscas no existe o fue eliminado.
        </p>
      </div>
    );
  }

  return <ProyectoDetailClient project={project} />;
}

