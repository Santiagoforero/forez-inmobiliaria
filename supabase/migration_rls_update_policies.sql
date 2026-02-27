-- ============================================================
-- RLS: Permitir UPDATE en properties y projects (para editar)
-- Ejecuta en Supabase SQL Editor. Sin esto, editar no guarda.
-- ============================================================

DROP POLICY IF EXISTS "Allow public update properties" ON public.properties;
CREATE POLICY "Allow public update properties"
ON public.properties
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update projects" ON public.projects;
CREATE POLICY "Allow public update projects"
ON public.projects
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
