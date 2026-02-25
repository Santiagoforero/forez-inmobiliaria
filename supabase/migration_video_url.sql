-- ============================================================
-- Migración: agregar columna video_url a properties
-- Ejecuta en Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS video_url TEXT;
