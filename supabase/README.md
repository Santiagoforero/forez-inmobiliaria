# Supabase - Forez Inmobiliaria

## Configuración inicial

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a **SQL Editor**.
3. Crea una nueva query y pega el contenido completo de `schema.sql`.
4. Ejecuta la query (**Run**).
5. Si todo va bien, verás tablas `properties` y `leads` creadas.

## Migración: agregar columna video_url

Si ya tienes la tabla `properties` creada, ejecuta `migration_video_url.sql` para agregar la columna de video de YouTube.

## Tablas

- **properties**: Precio usa `BIGINT` para soportar valores en miles de millones COP.
- **leads**: Formulario de contacto asociado a cada propiedad.

## Credenciales

Asegúrate de tener en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real
```
