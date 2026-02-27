import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  estado: string;
  categoria: string;
  precio: number | null;
  images: string[];
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProyectosPage() {
  const { data } = await supabase
    .from("projects")
    .select("id, slug, titulo, descripcion, ciudad, estado, categoria, precio, images")
    .order("created_at", { ascending: false });

  const proyectos = (data as Project[] | null) ?? [];

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Proyectos sobre planos
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Proyectos inmobiliarios con visión de largo plazo
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Desarrollos residenciales, comerciales e industriales en etapa de preventa
            y construcción. Información clara de licencias, planos, renders y
            entregas estimadas.
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {proyectos.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              Pronto publicaremos nuevos proyectos sobre planos.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {proyectos.map((p) => (
                <article
                  key={p.id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.titulo}
                      fill
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-900 shadow-sm">
                      {p.ciudad} • {p.estado}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
                      {p.categoria}
                    </p>
                    <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {p.titulo}
                    </h2>
                    {typeof p.precio === "number" && p.precio > 0 && (
                      <p className="text-sm font-semibold text-emerald-700">
                        Desde {formatCOP(p.precio)}
                      </p>
                    )}
                    <p className="line-clamp-3 text-xs text-slate-600">
                      {p.descripcion}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={`/proyectos/${p.id}`}
                        className="text-xs font-semibold text-[#0A2540] hover:underline"
                      >
                        Ver detalles del proyecto
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

