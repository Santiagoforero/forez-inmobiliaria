-- ============================================================
-- FOREZ INMOBILIARIA - Ejemplo completo: 1 propiedad + 1 proyecto
-- Con TODOS los campos rellenados (imágenes, planos, videos, entorno, licencias)
-- Ejecutar después de full_schema_forez.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROPIEDAD DE EJEMPLO (apartamento en venta, todo incluido)
-- ------------------------------------------------------------
INSERT INTO public.properties (
  slug,
  titulo,
  "descripcionCorta",
  "descripcionLarga",
  precio,
  ciudad,
  tipo,
  barrio,
  metros,
  habitaciones,
  banos,
  images,
  video_url,
  tour360_url,
  categoria,
  tags,
  entorno,
  entorno_imagenes,
  entorno_videos,
  entorno_archivos,
  planos_urls,
  licencia_archivos,
  lat,
  lng
) VALUES (
  'apartamento-ejemplo-cabecera-123',
  'Apartamento 3 habitaciones con vista – Cabecera',
  'Apartamento amplio en torre nueva, sala comedor, cocina integral, 3 habitaciones, 2 baños, zona de lavandería. Conjunto con piscina y gimnasio.',
  'Hermoso apartamento en venta en el sector de Cabecera, en torre de solo 4 años. Cuenta con sala comedor amplia con ventanales, cocina con zona de barra, tres habitaciones (principal con walk-in closet y baño), dos baños completos y zona de lavandería. Acabados en porcelanato y carpintería en melamina. El conjunto ofrece piscina, gimnasio, salón comunal y parqueadero cubierto. Ideal para familia. Entrega inmediata.',
  485000000,
  'Bucaramanga',
  'Apartamento',
  'Cabecera',
  98,
  3,
  2,
  -- images: fotos reales del apartamento (salas, habitaciones, cocina)
  ARRAY[
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=90'
  ],
  'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'https://my.matterport.com/show/?m=example123',
  'Venta',
  ARRAY['Cabecera', 'Torre nueva', 'Piscina', 'Gimnasio', 'Entrega inmediata'],
  'Sector residencial tranquilo, cerca a centros comerciales, colegios y vías principales. Zona con alta valorización.',
  -- entorno_imagenes: fotos del barrio/entorno
  ARRAY[
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=90'
  ],
  ARRAY[
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ],
  ARRAY[
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  ],
  -- planos_urls: planos de planta (imágenes tipo plano)
  ARRAY[
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=90'
  ],
  ARRAY[
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  ],
  7.1250,
  -73.1190
);

-- ------------------------------------------------------------
-- 2. PROYECTO DE EJEMPLO (torre en construcción, todo incluido)
-- ------------------------------------------------------------
INSERT INTO public.projects (
  slug,
  titulo,
  descripcion,
  ciudad,
  estado,
  categoria,
  precio,
  fecha_entrega_estimada,
  images,
  planos_urls,
  licencia_url,
  licencia_archivos,
  video_url,
  entorno,
  entorno_imagenes,
  entorno_videos,
  entorno_archivos,
  lat,
  lng
) VALUES (
  'torre-ejemplo-alta-gama-2027',
  'Torre Alta Gama – Ejemplo Completo',
  'Proyecto de apartamentos y penthouse de alta gama con lobby tipo hotel, amenidades de lujo (piscina, gimnasio, coworking, rooftop) y acabados premium. Incluye planos de todas las tipologías, licencia de construcción y videos del avance de obra.',
  'Bucaramanga',
  'En construcción',
  'Residencial',
  680000000,
  '2027-06-30',
  -- images: renders del proyecto
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90'
  ],
  -- planos_urls: planos de planta del proyecto
  ARRAY[
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=90'
  ],
  'https://www.alcaldiabucaramanga.gov.co/licencias',
  ARRAY[
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  ],
  'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'Ubicado en zona de alta valorización, con excelente conectividad, cerca a centros comerciales, colegios y parques. Entorno seguro y bien dotado.',
  ARRAY[
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90'
  ],
  ARRAY[
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ],
  ARRAY[
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  ],
  7.1260,
  -73.1185
);

-- Listo. Puedes verificar con:
-- SELECT slug, titulo, array_length(images,1), array_length(planos_urls,1) FROM properties WHERE slug = 'apartamento-ejemplo-cabecera-123';
-- SELECT slug, titulo, array_length(images,1), array_length(planos_urls,1) FROM projects WHERE slug = 'torre-ejemplo-alta-gama-2027';
