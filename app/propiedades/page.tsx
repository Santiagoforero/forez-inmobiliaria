import { getPropertiesFromSupabase } from "@/lib/supabase";
import PropiedadesClient from "@/components/PropiedadesClient";

export default async function PropiedadesPage() {
  const properties = await getPropertiesFromSupabase();
  return <PropiedadesClient initialProperties={properties} />;
}
