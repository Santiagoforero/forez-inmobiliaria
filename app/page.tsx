import { getPropertiesFromSupabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getPropertiesFromSupabase();
  return <HomeClient initialProperties={properties} />;
}

