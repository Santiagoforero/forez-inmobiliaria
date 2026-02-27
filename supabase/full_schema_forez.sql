-- ============================================================
-- FOREZ INMOBILIARIA - ESQUEMA COMPLETO Y RLS
-- Ejecuta ESTE archivo en Supabase (SQL Editor) para dejar
-- TODO funcionando: tablas, columnas nuevas, RLS y storage.
--
-- Es idempotente: lo puedes ejecutar varias veces sin romper datos.
-- ============================================================

-- Extensión para gen_random_uuid (suele venir activada en Supabase,
-- pero lo dejamos por si acaso).
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- 1. TABLA properties
-- =========================

CREATE TABLE IF NOT EXISTS public.properties (
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
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  tour360_url TEXT,
  categoria TEXT,
  tags TEXT[] DEFAULT '{}',
  entorno TEXT,
  entorno_imagenes TEXT[] DEFAULT '{}',
  entorno_videos TEXT[] DEFAULT '{}',
  entorno_archivos TEXT[] DEFAULT '{}',
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Asegurar tipos/columnas clave en properties (por si viene de un esquema viejo)
ALTER TABLE public.properties
  ALTER COLUMN precio TYPE BIGINT,
  ALTER COLUMN barrio SET DEFAULT '',
  ALTER COLUMN images SET DEFAULT '{}',
  ALTER COLUMN lat TYPE DECIMAL(10,7) USING lat::decimal,
  ALTER COLUMN lng TYPE DECIMAL(10,7) USING lng::decimal,
  ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS tour360_url TEXT,
  ADD COLUMN IF NOT EXISTS categoria TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno TEXT,
  ADD COLUMN IF NOT EXISTS entorno_imagenes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_videos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_archivos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS planos_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS licencia_archivos TEXT[] DEFAULT '{}';

-- Índices
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_ciudad ON public.properties(ciudad);
CREATE INDEX IF NOT EXISTS idx_properties_tipo ON public.properties(tipo);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

-- =========================
-- 2. TABLA leads
-- =========================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  propiedad_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  propiedad_titulo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_propiedad_id ON public.leads(propiedad_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- =========================
-- 3. TABLA projects
-- =========================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  estado TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio BIGINT,
  fecha_entrega_estimada DATE,
  images TEXT[] NOT NULL DEFAULT '{}',
  planos_urls TEXT[] DEFAULT '{}',
  licencia_url TEXT,
  licencia_archivos TEXT[] DEFAULT '{}',
  video_url TEXT,
  entorno TEXT,
  entorno_imagenes TEXT[] DEFAULT '{}',
  entorno_videos TEXT[] DEFAULT '{}',
  entorno_archivos TEXT[] DEFAULT '{}',
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects
  ALTER COLUMN images SET DEFAULT '{}',
  ALTER COLUMN planos_urls SET DEFAULT '{}',
  ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS fecha_entrega_estimada DATE,
  ADD COLUMN IF NOT EXISTS precio BIGINT,
  ADD COLUMN IF NOT EXISTS planos_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS licencia_url TEXT,
  ADD COLUMN IF NOT EXISTS licencia_archivos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS entorno TEXT,
  ADD COLUMN IF NOT EXISTS entorno_imagenes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_videos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_archivos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS lat DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS lng DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_ciudad ON public.projects(ciudad);
CREATE INDEX IF NOT EXISTS idx_projects_categoria ON public.projects(categoria);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- =========================
-- 4. TABLA dream_requests
-- =========================

CREATE TABLE IF NOT EXISTS public.dream_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  ubicacion_deseada TEXT,
  tipo_deseado TEXT,
  presupuesto_max BIGINT,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dream_requests_created_at ON public.dream_requests(created_at DESC);

-- =========================
-- 5. RLS Y POLÍTICAS
-- =========================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_requests ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas (si existen) para evitar conflictos
DO $$
BEGIN
  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'properties';
  IF FOUND THEN
    DROP POLICY IF EXISTS "Allow public read properties" ON public.properties;
    DROP POLICY IF EXISTS "Allow public insert properties" ON public.properties;
    DROP POLICY IF EXISTS "Allow public update properties" ON public.properties;
  END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'leads';
  IF FOUND THEN
    DROP POLICY IF EXISTS "Allow public read leads" ON public.leads;
    DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
  END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects';
  IF FOUND THEN
    DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
    DROP POLICY IF EXISTS "Allow public insert projects" ON public.projects;
    DROP POLICY IF EXISTS "Allow public update projects" ON public.projects;
  END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'dream_requests';
  IF FOUND THEN
    DROP POLICY IF EXISTS "Allow public insert dream_requests" ON public.dream_requests;
  END IF;
END
$$;

-- Nuevas políticas claras

CREATE POLICY "Allow public read properties"
ON public.properties
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert properties"
ON public.properties
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update properties"
ON public.properties
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read leads"
ON public.leads
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public read projects"
ON public.projects
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert projects"
ON public.projects
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update projects"
ON public.projects
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert dream_requests"
ON public.dream_requests
FOR INSERT
TO public
WITH CHECK (true);

-- =========================
-- 6. STORAGE BUCKETS Y POLÍTICAS
-- =========================

-- Bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para activos de entorno (imágenes, PDFs, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('entorno-assets', 'entorno-assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Políticas de storage por bucket
DO $$
BEGIN
  -- property-images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public upload property images'
  ) THEN
    CREATE POLICY "Allow public upload property images"
      ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'property-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public read property images'
  ) THEN
    CREATE POLICY "Allow public read property images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'property-images');
  END IF;

  -- entorno-assets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read entorno assets'
  ) THEN
    CREATE POLICY "Public read entorno assets"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'entorno-assets');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public upload entorno assets'
  ) THEN
    CREATE POLICY "Public upload entorno assets"
      ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'entorno-assets');
  END IF;
END
$$;

-- ============================================================
-- FIN full_schema_forez.sql
-- PASOS:
-- 1) Abre Supabase > SQL Editor
-- 2) New Query > pega este archivo completo > Run
-- 3) Refresca el Dashboard (para que el "schema cache" vea las nuevas columnas)
-- 4) Reinicia tu app (npm run dev / despliegue)
-- ============================================================

