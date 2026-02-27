-- ============================================================
-- FOREZ INMOBILIARIA - Cambios puntuales:
-- 1) Video de presentación en projects
-- 2) Tabla para formularios de contacto
-- ============================================================

-- 1) Asegurar columna de video de presentación en projects
--    (enlace YouTube u otro embed)

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Si tu tabla se creó sin prefijo de esquema (por migraciones viejas):
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS video_url TEXT;


-- 2) Tabla para guardar formularios de la página de contacto

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  ciudad_interes TEXT,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_messages'
      AND policyname = 'Allow public insert contact_messages'
  ) THEN
    CREATE POLICY "Allow public insert contact_messages"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (true);
  END IF;
END
$$;

