# CoKicks Product Data

Los productos temporales viven en `products.ts`. Esta capa esta pensada para
migrar luego a Supabase sin cambiar las paginas principales.

## Campos del listing

- `id`: identificador interno unico.
- `slug`: URL del producto, en minusculas y con guiones.
- `name`: nombre visible del listing.
- `brand`: marca. Debe coincidir con una marca en `brands.ts`.
- `model`: modelo especifico.
- `price`: precio en USD, sin simbolo.
- `sizes`: sizes disponibles como texto.
- `description`: descripcion corta.
- `images`: URLs o rutas de imagenes.
- `addedAt`: fecha ISO `YYYY-MM-DD`.

## Imagenes reales

Cuando esten listas, coloca archivos en `public/products/` y referencia rutas
asi:

```ts
images: ["/products/jordan-4-bred-1.jpg", "/products/jordan-4-bred-2.jpg"]
```

## Futuro Supabase

Las paginas usan `productQueries.ts` para leer, filtrar y buscar productos. Al
conectar Supabase, esa capa puede reemplazarse por queries reales manteniendo
los mismos tipos.
