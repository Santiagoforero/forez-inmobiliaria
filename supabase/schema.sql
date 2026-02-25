-- ============================================================
-- FOREZ INMOBILIARIA - Esquema Supabase 100% funcional
-- Ejecuta este SQL completo en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Eliminar políticas RLS existentes (si hay)
DROP POLICY IF EXISTS "Allow public read properties" ON properties;
DROP POLICY IF EXISTS "Allow public insert properties" ON properties;
DROP POLICY IF EXISTS "Allow public read leads" ON leads;
DROP POLICY IF EXISTS "Allow public insert leads" ON leads;

-- 2. Eliminar tablas (para recrear desde cero)
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS properties;

-- 3. Crear tabla properties (precio BIGINT para soportar miles de millones COP)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcionCorta TEXT,
  descripcionLarga TEXT NOT NULL,
  precio BIGINT NOT NULL,
  ciudad TEXT NOT NULL,
  tipo TEXT NOT NULL,
  barrio TEXT NOT NULL DEFAULT '',
  metros INTEGER NOT NULL,
  habitaciones INTEGER NOT NULL,
  banos INTEGER NOT NULL,
  images TEXT[] NOT NULL CHECK (array_length(images, 1) >= 1),
  video_url TEXT,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear tabla leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  propiedad_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  propiedad_titulo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_ciudad ON properties(ciudad);
CREATE INDEX IF NOT EXISTS idx_properties_tipo ON properties(tipo);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_propiedad_id ON leads(propiedad_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- 6. Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 7. Políticas: permitir SELECT e INSERT públicos (para app cliente + seed + publicar + leads)
CREATE POLICY "Allow public read properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert properties" ON properties
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read leads" ON leads
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- 8. Storage bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 9. Políticas storage: permitir subir y leer imágenes
DROP POLICY IF EXISTS "Allow public upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read property images" ON storage.objects;

CREATE POLICY "Allow public upload property images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public read property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

-- ============================================================
-- LISTO. Ejecuta este archivo completo en:
-- Supabase Dashboard > SQL Editor > New query > Pegar y Run
--
-- Luego reinicia tu app: npm run dev
-- El seed se ejecutará al arrancar y llenará properties.
-- ============================================================
