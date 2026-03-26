import type { MetadataRoute } from "next";
import { supabase, getPropertiesFromSupabase } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forez.com.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/propiedades`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/proyectos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/sobre-nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const properties = await getPropertiesFromSupabase();
  const propertyRoutes: MetadataRoute.Sitemap = properties
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: `${BASE_URL}/propiedades/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const { data: projects } = await supabase
    .from("projects")
    .select("slug")
    .not("slug", "is", null);

  const projectRoutes: MetadataRoute.Sitemap = ((projects as { slug: string }[] | null) ?? [])
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: `${BASE_URL}/proyectos/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...propertyRoutes, ...projectRoutes];
}
