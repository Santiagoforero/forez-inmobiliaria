-- ============================================================
-- FOREZ INMOBILIARIA - Migración extra
-- Ejecuta este archivo DESPUÉS de schema.sql en Supabase
-- ============================================================

-- 1. Nuevas columnas en properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS tour360_url TEXT,
  ADD COLUMN IF NOT EXISTS categoria TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno TEXT;

-- 2. Tabla projects para proyectos sobre planos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  estado TEXT NOT NULL,             -- 'Preventa', 'En construcción', 'Entregado'
  categoria TEXT NOT NULL,          -- 'Residencial', 'Comercial', 'Industrial', 'Mixto', etc.
  precio BIGINT,
  fecha_entrega_estimada DATE,
  images TEXT[] NOT NULL CHECK (array_length(images, 1) >= 1), -- renders principales
  planos_urls TEXT[] DEFAULT '{}',  -- planos aprobados
  licencia_url TEXT,                -- enlace a licencia / documento
  video_url TEXT,
  entorno TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existía antes de esta migración, asegura columnas nuevas (sin romper datos).
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS fecha_entrega_estimada DATE,
  ADD COLUMN IF NOT EXISTS precio BIGINT,
  ADD COLUMN IF NOT EXISTS planos_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS licencia_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS entorno TEXT,
  ADD COLUMN IF NOT EXISTS lat DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS lng DECIMAL(10,7),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Índices para projects
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_ciudad ON projects(ciudad);
CREATE INDEX IF NOT EXISTS idx_projects_categoria ON projects(categoria);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 4. RLS y políticas para projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read projects" ON projects;
DROP POLICY IF EXISTS "Allow public insert projects" ON projects;

CREATE POLICY "Allow public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert projects" ON projects
  FOR INSERT WITH CHECK (true);

-- 5. Tabla para solicitudes de inmueble ideal
CREATE TABLE IF NOT EXISTS dream_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  ubicacion_deseada TEXT,
  tipo_deseado TEXT,
  presupuesto_max BIGINT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dream_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert dream_requests" ON dream_requests;

CREATE POLICY "Allow public insert dream_requests" ON dream_requests
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- FIN migration_extras.sql
-- ============================================================

