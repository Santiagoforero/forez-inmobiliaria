export type Property = {
  id: number;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  precio: number;
  ciudad: string;
  tipo: string;
  barrio?: string;
  metros: number;
  habitaciones: number;
  banos: number;
  imagenes: string[];
  imagenesStaging: string[];
  imagenes360: string[];
  videoUrl?: string;
  categoria?: string;
  tags?: string[];
  entorno?: string;
  entornoImagenes?: string[];
  entornoVideos?: string[];
  entornoArchivos?: string[];
  planosUrls?: string[];
  licenciaArchivos?: string[];
  coords: { lat: number; lng: number };
  remoteId?: string;
};

export const propiedades: Property[] = [
];

export function getPropertyById(id: number): Property | undefined {
  return propiedades.find((p) => p.id === id);
}

