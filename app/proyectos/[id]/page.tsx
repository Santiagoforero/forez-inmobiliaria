import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProyectoDetailClient } from "@/components/ProyectoDetailClient";
import { buildProjectSlug } from "@/lib/slug";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forez.co";
export const revalidate = 300;

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

async function fetchProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const fullSelect =
    "id, slug, titulo, descripcion, ciudad, estado, categoria, precio, fecha_entrega_estimada, images, planos_urls, licencia_url, licencia_archivos, video_url, entorno, entorno_imagenes, entorno_videos, entorno_archivos, lat, lng";
  const { data, error } = await supabase
    .from("projects")
    .select(fullSelect)
    .eq("slug", slug)
    .maybeSingle<ProjectRow>();
  if (error) return null;
  return data ?? null;
}

function buildProjectSeoTitle(project: ProjectRow) {
  const ciudad = project.ciudad || "Colombia";
  return `${project.titulo} en ${ciudad} | Proyecto inmobiliario | Forez Inmobiliaria`;
}

function buildProjectSeoText(project: ProjectRow) {
  return `Este proyecto en ${project.ciudad} se desarrolla en una zona con alta proyección urbana y comercial, ideal para compradores que buscan una combinación entre valorización, calidad constructiva y visión de largo plazo. ${project.descripcion} En FOREZ evaluamos factores clave como conectividad, demanda residencial o corporativa, desarrollo del entorno y cronogramas de obra para ofrecer información clara y útil durante todo el proceso.

Por su categoría ${project.categoria.toLowerCase()} y estado ${project.estado.toLowerCase()}, este activo se ajusta a diferentes estrategias: compra para habitar, diversificación patrimonial o entrada temprana a proyectos sobre planos. El comportamiento del mercado en ${project.ciudad} ha mostrado interés sostenido en desarrollos bien ubicados, especialmente cuando el proyecto cuenta con documentación, licencias y soporte visual completo para la toma de decisiones.

Desde la óptica de inversión, evaluar el precio de entrada, la etapa de desarrollo y la dinámica del sector permite proyectar escenarios realistas de valorización y rentabilidad. El análisis del entorno inmediato también aporta señales relevantes sobre plusvalía futura, acceso a servicios y perfil de demanda en el mediano plazo.

Si estás considerando invertir en ${project.ciudad}, este proyecto puede ser una alternativa competitiva dentro del portafolio local. En FOREZ te acompañamos con asesoría comercial y técnica para revisar comparables, resolver dudas legales y estructurar una decisión informada, con foco en seguridad, oportunidad y potencial de crecimiento.`;
}

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id: identifier } = await params;
  const project = (await fetchProjectById(identifier)) ?? (await fetchProjectBySlug(identifier));

  if (!project) {
    return {
      title: "Proyecto no encontrado | Forez Inmobiliaria",
      description: "El proyecto que buscas no existe o fue eliminado.",
    };
  }

  const title = buildProjectSeoTitle(project);
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
      url: `${BASE_URL}/proyectos/${project.slug || identifier}`,
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
  const { id: identifier } = await params;

  let project = await fetchProjectById(identifier);
  let matchedBy: "id" | "slug" | null = null;
  if (project) {
    matchedBy = "id";
  } else {
    project = await fetchProjectBySlug(identifier);
    matchedBy = project ? "slug" : null;
  }

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

  if (!project.slug?.trim()) {
    const generatedSlug =
      buildProjectSlug({
        titulo: project.titulo,
        ciudad: project.ciudad,
        tipo: project.categoria,
      }) || `proyecto-${Date.now()}`;
    project.slug = generatedSlug;
    await supabase.from("projects").update({ slug: generatedSlug }).eq("id", project.id);
  }

  if (matchedBy === "id" && project.slug && project.slug !== identifier) {
    permanentRedirect(`/proyectos/${project.slug}`);
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: project.titulo,
    description: project.descripcion,
    url: `${BASE_URL}/proyectos/${project.slug || identifier}`,
    image: project.images,
    geo:
      project.lat != null && project.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: Number(project.lat),
            longitude: Number(project.lng),
          }
        : undefined,
  };

  return (
    <>
      <ProyectoDetailClient project={project} />
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Panorama inmobiliario en {project.ciudad}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
            {buildProjectSeoText(project)}
          </p>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
    </>
  );
}

