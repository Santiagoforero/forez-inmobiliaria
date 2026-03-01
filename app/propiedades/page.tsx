import { getPropertiesFromSupabase } from "@/lib/supabase";
import PropiedadesClient from "@/components/PropiedadesClient";

export const dynamic = "force-dynamic";

export default async function PropiedadesPage() {
  const properties = await getPropertiesFromSupabase();
  return <PropiedadesClient initialProperties={properties} />;
}
