-- ============================================================
-- FOREZ INMOBILIARIA - Entorno y activos de sector
-- Ejecuta este archivo DESPUÉS de schema.sql y migration_extras.sql
-- ============================================================

-- 1. Nuevas columnas para entorno en properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS entorno_imagenes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_videos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_archivos TEXT[] DEFAULT '{}';

-- 2. Nuevas columnas para entorno en projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS entorno_imagenes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_videos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entorno_archivos TEXT[] DEFAULT '{}';

-- 3. Bucket de storage para activos de entorno (imágenes, videos cortos, PDFs, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('entorno-assets', 'entorno-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Políticas RLS para el bucket entorno-assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read entorno assets'
  ) THEN
    CREATE POLICY "Public read entorno assets"
      ON storage.objects
      FOR SELECT
      TO anon
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
      TO anon
      WITH CHECK (bucket_id = 'entorno-assets');
  END IF;
END
$$;

-- ============================================================
-- FIN migration_entorno_assets.sql
-- ============================================================

