import { createClient } from "@supabase/supabase-js";
import { propiedades } from "@/lib/properties";
import type { Property } from "@/lib/properties";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type SupabaseClient = typeof supabase;

export type SupabasePropertyRow = {
  id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string | null;
  descripcionLarga: string;
  precio: number;
  ciudad: string;
  tipo: string;
  barrio: string | null;
  metros: number;
  habitaciones: number;
  banos: number;
  images: string[];
  video_url?: string | null;
  lat: number;
  lng: number;
  created_at?: string;
};

export function mapSupabaseRowToProperty(row: SupabasePropertyRow, index = 0): Property {
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    id: index,
    slug: row.slug,
    titulo: row.titulo,
    descripcionCorta: row.descripcionCorta ?? "",
    descripcionLarga: row.descripcionLarga,
    precio: row.precio,
    ciudad: row.ciudad,
    tipo: row.tipo as "Apartamento" | "Casa" | "Penthouse",
    barrio: row.barrio ?? undefined,
    metros: row.metros,
    habitaciones: row.habitaciones,
    banos: row.banos,
    imagenes: images,
    imagenesStaging: [],
    imagenes360: [],
    videoUrl: row.video_url ?? undefined,
    coords: { lat: Number(row.lat), lng: Number(row.lng) },
    remoteId: row.id,
  };
}

export async function getPropertiesFromSupabase(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id,slug,titulo,descripcionCorta,descripcionLarga,precio,ciudad,tipo,barrio,metros,habitaciones,banos,images,video_url,lat,lng")
      .order("created_at", { ascending: false });

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[Supabase] Error fetching properties:", error.message);
      return [];
    }
    return (data ?? []).map((row, i) => mapSupabaseRowToProperty(row as SupabasePropertyRow, i));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Supabase] Exception fetching properties:", e);
    return [];
  }
}

export async function getPropertyByIdFromSupabase(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id,slug,titulo,descripcionCorta,descripcionLarga,precio,ciudad,tipo,barrio,metros,habitaciones,banos,images,video_url,lat,lng")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabaseRowToProperty(data as SupabasePropertyRow, 0);
  } catch {
    return null;
  }
}

let seedPromise: Promise<void> | null = null;

export async function seedProperties() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id")
      .limit(1);

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[Supabase Seed] Error checking table:", error.message);
      return;
    }
    if (data && data.length > 0) return; // ya hay datos

    const rows = propiedades.map((p) => ({
      slug: p.slug,
      titulo: p.titulo,
      descripcionCorta: p.descripcionCorta,
      descripcionLarga: p.descripcionLarga,
      precio: p.precio,
      ciudad: p.ciudad,
      tipo: p.tipo,
      barrio: p.barrio ?? "",
      metros: p.metros,
      habitaciones: p.habitaciones,
      banos: p.banos,
      images: p.imagenes,
      lat: p.coords.lat,
      lng: p.coords.lng,
    }));

    const { error: insertError } = await supabase.from("properties").insert(rows);
    if (insertError) {
      // eslint-disable-next-line no-console
      console.warn("[Supabase Seed] Error inserting:", insertError.message);
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`✅ SEED COMPLETADO: Se insertaron ${rows.length} propiedades en Supabase`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Supabase Seed] Exception:", e);
  }
}

export function ensureSeedOnBoot() {
  if (!seedPromise) {
    seedPromise = seedProperties();
  }
  return seedPromise;
}

