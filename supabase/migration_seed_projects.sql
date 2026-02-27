-- ============================================================
-- FOREZ INMOBILIARIA - Seed de proyectos sobre planos
-- Ejecutar después de migration_extras.sql
-- ============================================================

INSERT INTO projects (
  slug, titulo, descripcion, ciudad, estado, categoria,
  fecha_entrega_estimada, images, planos_urls, licencia_url, video_url,
  lat, lng
) VALUES
(
  'torre-horizon-cabecera',
  'Torre Horizon Cabecera',
  'Proyecto de apartamentos de alta gama con lobby tipo hotel, club house y rooftop panorámico sobre Cabecera.',
  'Bucaramanga',
  'Preventa',
  'Residencial',
  '2027-06-30',
  ARRAY[
    'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80'
  ],
  NULL,
  NULL,
  7.1250, -73.1190
),
(
  'parque-empresarial-oriente',
  'Parque Empresarial Oriente',
  'Complejo de bodegas y oficinas para logística y última milla, con acceso directo a vías principales.',
  'Bogotá',
  'En construcción',
  'Industrial',
  '2026-12-31',
  ARRAY[
    'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  4.6766, -74.0489
),
(
  'plaza-gourmet-chico',
  'Plaza Gourmet Chicó',
  'Localidades comerciales tipo food hall con terrazas y zonas verdes integradas al sector Chicó.',
  'Bogotá',
  'Preventa',
  'Comercial',
  '2026-09-30',
  ARRAY[
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  4.6766, -74.0500
),
(
  'ciudadela-verde-occidente',
  'Ciudadela Verde de Occidente',
  'Macroproyecto residencial con parques, colegios y comercio vecinal integrado.',
  'Medellín',
  'En construcción',
  'Residencial',
  '2028-03-31',
  ARRAY[
    'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  6.2088, -75.5655
),
(
  'industrial-park-metro',
  'Industrial Park Metro',
  'Plataforma industrial con bodegas modulares y áreas para industria liviana con conexión férrea.',
  'Medellín',
  'Preventa',
  'Industrial',
  '2027-11-30',
  ARRAY[
    'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  6.22, -75.57
),
(
  'bayside-residences-manga',
  'Bayside Residences Manga',
  'Proyecto residencial frente a bahía con club náutico, piscina infinita y muelle privado.',
  'Cartagena',
  'Preventa',
  'Residencial',
  '2028-08-31',
  ARRAY[
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  10.413, -75.540
),
(
  'plaza-empresarial-cabecera',
  'Plaza Empresarial Cabecera',
  'Oficinas corporativas clase A con locales comerciales en el primer nivel y terraza ejecutiva.',
  'Bucaramanga',
  'En construcción',
  'Comercial',
  '2026-05-31',
  ARRAY[
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  7.125, -73.118
),
(
  'logistic-hub-santander',
  'Logistic Hub Santander',
  'Parque logístico de bodegas de gran formato orientado a industria y distribución regional.',
  'Bucaramanga',
  'Preventa',
  'Industrial',
  '2027-02-28',
  ARRAY[
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  7.20, -73.20
),
(
  'sky-lofts-poblado',
  'Sky Lofts El Poblado',
  'Lofts de doble altura enfocados en inversión, con operación tipo condo-hotel.',
  'Medellín',
  'En construcción',
  'Residencial',
  '2026-10-31',
  ARRAY[
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  'https://www.youtube.com/watch?v=ysz5v6Uc6P8',
  6.21, -75.57
),
(
  'business-district-norte',
  'Business District Norte',
  'Distrito empresarial con torres de oficinas, comercio y zonas de coworking de última generación.',
  'Bogotá',
  'Preventa',
  'Comercial',
  '2029-03-31',
  ARRAY[
    'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  4.72, -74.05
);

-- ============================================================
-- FIN migration_seed_projects.sql
-- ============================================================

