# CoKicks

Catalogo premium de sneakers construido con React, TypeScript y Vite.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

`npm run build` tambien genera el fallback `dist/404.html` para hosting SPA.

## Rutas

- `/`
- `/catalogo`
- `/marcas`
- `/producto/:slug`
- `/politicas`
- `/contacto`
- `/admin` solo en desarrollo local o con `VITE_ENABLE_ADMIN=true`

## Datos

Los listings publicos se leen desde Supabase. No hay productos de ejemplo ni
fotos stock incluidos en el proyecto.

El panel `/admin` permite subir fotos reales y administrar cada listing sin
editar codigo.

## Assets reales

- Logo: `public/brand/`
- Fotos de productos: Supabase Storage mediante `/admin`
