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

Los listings temporales viven en `src/data/products.ts`.

La capa `src/data/productQueries.ts` separa la lectura/filtrado de productos
para facilitar una migracion futura a Supabase.

## Assets reales

- Logo: `public/brand/`
- Productos: `public/products/`
- Hero: `public/hero/`
