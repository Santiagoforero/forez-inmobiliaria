import { getPropertiesFromSupabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const properties = await getPropertiesFromSupabase();
  return <HomeClient initialProperties={properties} />;
}
