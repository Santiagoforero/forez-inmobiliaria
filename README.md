## Forez Inmobiliaria - Web premium Next.js

Aplicación web para **Forez Inmobiliaria**, una inmobiliaria premium enfocada en propiedades de alto nivel en **Bucaramanga, Bogotá, Medellín y otras ciudades de Colombia**.

### Tecnología principal

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4**
- **shadcn/ui** (componentes `Button`, `Card`, `Input`, `Sheet`, etc.)
- **Framer Motion** para animaciones suaves
- **Supabase** para autenticación y backend

---

## Requisitos previos

- Node.js 18+ instalado.
- Cuenta y proyecto en [Supabase](https://supabase.com).

---

## Instalación y arranque

1. Clonar o copiar el proyecto en tu máquina.
2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo `.env.local` en la raíz del proyecto tomando como referencia `.env.example`:

```bash
cp .env.example .env.local
```

4. Configurar variables de entorno en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
NEXT_PUBLIC_MAPBOX_TOKEN=tu_mapbox_token_aqui
```

Estos valores los encuentras en el panel de tu proyecto Supabase (`Project Settings` → `API`).

5. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Estructura principal del proyecto

- `app/layout.tsx`: Layout raíz, **Navbar** con logo de Forez, navegación principal y pie de página.
- `app/page.tsx`: Home con **hero** impactante, búsqueda avanzada, propiedades destacadas y **mapa 3D (Mapbox)**.
- `app/propiedades/page.tsx`: Grid de tarjetas de propiedades con datos mock (imagen, título, precio, ubicación, habitaciones, baños y m²).
- `app/auth/page.tsx`: Pantalla de autenticación usando **Supabase Auth UI** (login/register con email/contraseña).
- `components/navbar.tsx`: Barra de navegación superior, versión desktop + mobile (con `Sheet` de shadcn/ui).
- `components/ui/*`: Componentes base de shadcn/ui (Button, Card, Input, Sheet).
- `lib/supabase.ts`: Inicialización del cliente de Supabase usando variables de entorno públicas.

---

## Diseño y branding

- **Tema premium claro**: fondos blancos/gris claro con acentos azules.
- Color de acento principal: `#0A2540` (botones y elementos clave).
- Tipografía principal: **Inter** (cargada vía `next/font`).
- Navbar incluye:
  - Logo con `<Image src="/logo.png" alt="Forez Inmobiliaria" />`.
  - Links: Inicio, Propiedades, Sobre Nosotros, Contacto.
  - Botones de **Ingresar** y **Crear cuenta**.

> Nota: puedes reemplazar `public/logo.png` por el archivo definitivo respetando el mismo nombre o actualizar la ruta en `components/navbar.tsx`.

---

## Supabase e inicio de sesión

- Cliente configurado en `lib/supabase.ts` con:
  - `process.env.NEXT_PUBLIC_SUPABASE_URL`
  - `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Pantalla `/auth`:
  - Usa `@supabase/auth-ui-react` para login y registro con email/contraseña.
  - Cambia entre **login** y **register** mediante el query param `mode`:
    - `/auth?mode=login`
    - `/auth?mode=register`

Puedes personalizar completamente el flujo y los formularios de autenticación más adelante si lo prefieres.

---

## Logo y assets

1. Añade tu logo en `public/logo.png`.
2. El Navbar ya usa:

```tsx
<Image src="/logo.png" alt="Forez Inmobiliaria" fill className="object-contain" />
```

Si el archivo tiene otro nombre o formato, actualiza esta referencia en `components/navbar.tsx`.

---

## Scripts disponibles

- `npm run dev`: Arranca el servidor de desarrollo.
- `npm run build`: Genera el build de producción.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el linter.

---

## Próximos pasos recomendados

- Conectar la lista de propiedades a tablas reales en Supabase.
- Ajustar el estilo y zoom del mapa 3D según ciudad/portafolio.
- Añadir páginas de **Sobre Nosotros** y **Contacto** con contenido corporativo.
- Ampliar el sistema de filtros de propiedades (rango de precios, tipo, número de habitaciones, etc.).

Este proyecto está preparado para crecer hacia una plataforma inmobiliaria premium con backend en Supabase y un frontend moderno en Next.js 16.

