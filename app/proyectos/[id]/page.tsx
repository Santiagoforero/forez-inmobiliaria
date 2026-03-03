import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ProyectoDetailClient } from "@/components/ProyectoDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forez.co";

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

type ParamsProps = {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    return {
      title: "Proyecto no encontrado | Forez Inmobiliaria",
      description: "El proyecto que buscas no existe o fue eliminado.",
    };
  }

  const title = `${project.titulo} | Forez Inmobiliaria`;
  const rawDesc =
    project.descripcion ||
    "Proyecto inmobiliario en Colombia gestionado por Forez Inmobiliaria.";
  const description =
    rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  const mainImage = project.images?.[0];
  const imageUrl = mainImage?.startsWith("http")
    ? mainImage
    : `${BASE_URL}${mainImage || "/logo.png"}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/proyectos/${id}`,
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

export default async function ProyectoPage({ params }: ParamsProps) {
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

