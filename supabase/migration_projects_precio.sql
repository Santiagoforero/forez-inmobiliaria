-- ============================================================
-- FOREZ INMOBILIARIA - Precio en projects
-- Ejecuta este archivo en el SQL Editor de Supabase
-- para agregar el campo de precio a la tabla de proyectos.
-- Es idempotente.
-- ============================================================

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS precio BIGINT;

-- Opcional: si tienes la tabla sin prefijo de esquema por migraciones viejas
-- (por defecto también es schema public), esto la cubre igual:
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS precio BIGINT;

