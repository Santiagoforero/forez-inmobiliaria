-- ============================================================
-- Licencia como documentos adjuntos en proyectos
-- Ejecuta en Supabase SQL Editor. Idempotente.
-- ============================================================

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS licencia_archivos TEXT[] DEFAULT '{}';

-- Opcional: migrar datos de licencia_url a licencia_archivos (un solo elemento)
-- Si quieres conservar los enlaces ya guardados como primer documento:
-- UPDATE public.projects
-- SET licencia_archivos = ARRAY[licencia_url]
-- WHERE licencia_url IS NOT NULL AND licencia_url != ''
--   AND (licencia_archivos IS NULL OR licencia_archivos = '{}');
