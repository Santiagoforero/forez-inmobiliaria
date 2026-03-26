export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildPropertySlug(input: {
  titulo?: string | null;
  ciudad?: string | null;
  tipo?: string | null;
}): string {
  const base = [input.titulo, input.ciudad, input.tipo]
    .filter(Boolean)
    .join(" ");
  return slugify(base);
}

export function buildProjectSlug(input: {
  titulo?: string | null;
  ciudad?: string | null;
  tipo?: string | null;
}): string {
  const base = [input.titulo, input.ciudad, input.tipo]
    .filter(Boolean)
    .join(" ");
  return slugify(base);
}
