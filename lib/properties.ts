export type Property = {
  id: number;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  precio: number;
  ciudad: string;
  tipo: "Apartamento" | "Casa" | "Penthouse";
  barrio?: string;
  metros: number;
  habitaciones: number;
  banos: number;
  imagenes: string[];
  imagenesStaging: string[];
  imagenes360: string[];
  videoUrl?: string;
  coords: { lat: number; lng: number };
  remoteId?: string;
};

export const propiedades: Property[] = [
  {
    id: 1,
    slug: "penthouse-lujo-bucaramanga-cabecera",
    titulo: "Penthouse de lujo en Cabecera",
    descripcionCorta:
      "Penthouse con vista 270°, terraza privada y jacuzzi en Cabecera.",
    descripcionLarga:
      "Penthouse en piso alto con vista 270° sobre Bucaramanga, terraza privada con jacuzzi, cocina abierta italiana y dos parqueaderos dobles en línea. Edificio con lobby tipo hotel, vigilancia 24/7 y salón social premium.",
    precio: 1250000000,
    ciudad: "Bucaramanga",
    tipo: "Penthouse",
    barrio: "Cabecera",
    coords: { lat: 7.125, lng: -73.119 },
    metros: 320,
    habitaciones: 4,
    banos: 5,
    imagenes: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 2,
    slug: "apartamento-corporativo-bogota-chico",
    titulo: "Apartamento corporativo en Chicó",
    descripcionCorta:
      "Apartamento amoblado ideal para ejecutivos, a pasos del parque de la 93.",
    descripcionLarga:
      "Apartamento de 2 habitaciones y estudio, completamente amoblado, con balcón y vista a zona verde. A pocos minutos de la 93 y zona empresarial de Chicó. Edificio con planta de suplencia total y sala de juntas para residentes.",
    precio: 980000000,
    ciudad: "Bogotá",
    tipo: "Apartamento",
    barrio: "Chicó",
    coords: { lat: 4.6766, lng: -74.0489 },
    metros: 210,
    habitaciones: 3,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 3,
    slug: "casa-moderna-medellin-poblado",
    titulo: "Casa moderna en El Poblado",
    descripcionCorta:
      "Casa contemporánea con doble altura y jardín interno en unidad cerrada.",
    descripcionLarga:
      "Casa de tres niveles con diseño contemporáneo, doble altura en zona social, jardín interno y deck exterior con BBQ. Unidad cerrada con portería 24/7, piscina y gimnasio. Acceso rápido a la Milla de Oro de El Poblado.",
    precio: 1850000000,
    ciudad: "Medellín",
    tipo: "Casa",
    barrio: "El Poblado",
    coords: { lat: 6.2088, lng: -75.5655 },
    metros: 380,
    habitaciones: 5,
    banos: 6,
    imagenes: [
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 4,
    slug: "apartamento-terraza-bogota-chico-norte",
    titulo: "Apartamento con terraza panorámica en Chicó Norte",
    descripcionCorta:
      "Apartamento con terraza de 40 m² y vista a los cerros orientales.",
    descripcionLarga:
      "Apartamento en último piso con terraza de 40 m², ideal para reuniones sociales. Zona social integrada, cocina abierta y cuarto de servicio. Edificio moderno con planta eléctrica y sala de coworking.",
    precio: 1650000000,
    ciudad: "Bogotá",
    tipo: "Apartamento",
    barrio: "Chicó Norte",
    coords: { lat: 4.6812, lng: -74.0419 },
    metros: 260,
    habitaciones: 3,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 5,
    slug: "casa-campestre-bucaramanga-rionegro",
    titulo: "Casa campestre en condominio cerrado",
    descripcionCorta:
      "Casa campestre con lote de 1.200 m², piscina y kiosko social.",
    descripcionLarga:
      "Casa campestre de un nivel con amplias zonas verdes, piscina privada, kiosko social y huerta. Condominio cerrado con vigilancia 24/7 y vías internas pavimentadas. Ideal para segunda vivienda o retiro.",
    precio: 1200000000,
    ciudad: "Bucaramanga",
    tipo: "Casa",
    barrio: "Rionegro",
    coords: { lat: 7.265, lng: -73.17 },
    metros: 450,
    habitaciones: 5,
    banos: 6,
    imagenes: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 6,
    slug: "apartamento-minimalista-medellin-laureles",
    titulo: "Apartamento minimalista con balcón",
    descripcionCorta:
      "Apartamento minimalista con balcón hacia zona verde en Laureles.",
    descripcionLarga:
      "Apartamento de 2 habitaciones con diseño minimalista, cocina abierta y balcón hacia zona verde. Edificio pequeño y tranquilo, ideal para quienes buscan comodidad y buena ubicación en Laureles.",
    precio: 690000000,
    ciudad: "Medellín",
    tipo: "Apartamento",
    barrio: "Laureles",
    coords: { lat: 6.2442, lng: -75.5966 },
    metros: 140,
    habitaciones: 2,
    banos: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 7,
    slug: "apartamento-bogota-rosales",
    titulo: "Apartamento clásico en Rosales",
    descripcionCorta:
      "Apartamento amplio con chimenea y vista a los cerros en Rosales.",
    descripcionLarga:
      "Apartamento clásico con generosas áreas sociales, chimenea y ventanales de piso a techo con vista a los cerros. Ideal para familias que buscan espacios amplios en uno de los barrios más tradicionales de Bogotá.",
    precio: 1450000000,
    ciudad: "Bogotá",
    tipo: "Apartamento",
    barrio: "Rosales",
    coords: { lat: 4.65, lng: -74.055 },
    metros: 280,
    habitaciones: 3,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 8,
    slug: "loft-industrial-medellin-ciudad-del-rio",
    titulo: "Loft industrial en Ciudad del Río",
    descripcionCorta:
      "Loft de doble altura tipo industrial en zona artística de Medellín.",
    descripcionLarga:
      "Loft de doble altura con ventanales de piso a techo, estructura vista y acabados tipo industrial. A pasos de museos, restaurantes y zonas creativas de Ciudad del Río.",
    precio: 820000000,
    ciudad: "Medellín",
    tipo: "Apartamento",
    barrio: "Ciudad del Río",
    coords: { lat: 6.2292, lng: -75.5737 },
    metros: 160,
    habitaciones: 2,
    banos: 2,
    imagenes: [
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 9,
    slug: "casa-bucaramanga-cañaveral",
    titulo: "Casa esquinera en Cañaveral",
    descripcionCorta:
      "Casa esquinera remodelada con jardín frontal y patio interior.",
    descripcionLarga:
      "Casa remodelada con cocina abierta, jardín frontal y patio interior, ubicada en calle tranquila de Cañaveral. Cercana a centros comerciales, clínicas y colegios.",
    precio: 780000000,
    ciudad: "Bucaramanga",
    tipo: "Casa",
    barrio: "Cañaveral",
    coords: { lat: 7.06, lng: -73.11 },
    metros: 210,
    habitaciones: 4,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 10,
    slug: "penthouse-bogota-santa-barbara",
    titulo: "Penthouse dúplex en Santa Bárbara",
    descripcionCorta:
      "Penthouse dúplex con estudio y terraza en Santa Bárbara.",
    descripcionLarga:
      "Penthouse dúplex con estudio independiente, terraza con BBQ y vista despejada hacia el oriente. Edificio con portería 24/7 y gimnasio.",
    precio: 1720000000,
    ciudad: "Bogotá",
    tipo: "Penthouse",
    barrio: "Santa Bárbara",
    coords: { lat: 4.707, lng: -74.035 },
    metros: 300,
    habitaciones: 4,
    banos: 5,
    imagenes: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 11,
    slug: "apartamento-medellin-envigado",
    titulo: "Apartamento en Envigado con vista verde",
    descripcionCorta:
      "Apartamento en Envigado con vista a reserva natural y balcón amplio.",
    descripcionLarga:
      "Apartamento de 3 habitaciones con balcón amplio hacia reserva natural, ideal para quienes buscan tranquilidad sin salir del área metropolitana.",
    precio: 760000000,
    ciudad: "Medellín",
    tipo: "Apartamento",
    barrio: "Envigado",
    coords: { lat: 6.1759, lng: -75.5917 },
    metros: 165,
    habitaciones: 3,
    banos: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 12,
    slug: "apartamento-bucaramanga-real-de-minas",
    titulo: "Apartamento remodelado en Real de Minas",
    descripcionCorta:
      "Apartamento remodelado con cocina abierta y buena iluminación.",
    descripcionLarga:
      "Apartamento con cocina abierta, acabados modernos y excelente iluminación natural, en edificio tradicional de Real de Minas.",
    precio: 520000000,
    ciudad: "Bucaramanga",
    tipo: "Apartamento",
    barrio: "Real de Minas",
    coords: { lat: 7.11, lng: -73.13 },
    metros: 110,
    habitaciones: 3,
    banos: 2,
    imagenes: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 13,
    slug: "apartamento-lujo-cali-granada",
    titulo: "Apartamento de lujo en Granada",
    descripcionCorta:
      "Apartamento con balcón, acabados premium y ubicación privilegiada en Cali.",
    descripcionLarga:
      "Apartamento amplio con sala-comedor integrada, balcón y acabados premium. Ubicación estratégica en Granada, cerca a gastronomía, comercio y vías principales. Edificio con lobby y seguridad 24/7.",
    precio: 840000000,
    ciudad: "Cali",
    tipo: "Apartamento",
    barrio: "Granada",
    coords: { lat: 3.4516, lng: -76.532 },
    metros: 170,
    habitaciones: 3,
    banos: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
  {
    id: 14,
    slug: "casa-cartagena-manga",
    titulo: "Casa colonial renovada en Manga",
    descripcionCorta:
      "Casa colonial renovada con patio interior y acabados de alto nivel en Cartagena.",
    descripcionLarga:
      "Casa colonial renovada con patio interior, iluminación cálida y acabados premium. Ubicación estratégica en Manga, a minutos de la ciudad amurallada. Ideal para vivienda o inversión.",
    precio: 2350000000,
    ciudad: "Cartagena",
    tipo: "Casa",
    barrio: "Manga",
    coords: { lat: 10.4106, lng: -75.5363 },
    metros: 420,
    habitaciones: 5,
    banos: 6,
    imagenes: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenesStaging: [
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    ],
    imagenes360: ["https://pannellum.org/images/alma.jpg"],
  },
];

export function getPropertyById(id: number): Property | undefined {
  return propiedades.find((p) => p.id === id);
}

