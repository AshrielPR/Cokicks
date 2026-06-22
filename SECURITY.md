# CoKicks Security Model

CoKicks usa Supabase Auth y Row Level Security para proteger el panel
administrativo y las operaciones de escritura.

## Reglas

- La informacion de contacto vive en `src/config/business.ts`.
- Los productos temporales viven en `src/data/products.ts`.
- Cambios de contacto o inventario requieren editar el codigo y desplegar una
  nueva version.
- En produccion, `/admin` solo se registra si `VITE_ENABLE_ADMIN=true`.
- La ruta `/admin` no revela datos privados y requiere autenticacion para crear,
  editar o eliminar listings.

## Futuro Supabase

Cuando se conecte Supabase, el admin debe cumplir:

- Supabase Auth obligatorio.
- Solo usuarios incluidos en `admin_users` pueden administrar listings.
- Row Level Security activado en todas las tablas.
- Policies que permitan escritura solo a administradores.
- Storage privado o con policies estrictas para subir fotos.
- Ninguna clave secreta debe vivir en el frontend.
- Variables publicas `VITE_*` solo pueden contener claves anon/public.

## GitHub Pages

GitHub Pages servira el frontend estatico. No debe guardar credenciales ni
secretos. El dominio propio debe configurarse con HTTPS.

## Dependencias

- Ejecutar `npm audit` antes de publicar.
- No usar `npm audit fix --force` sin revisar cambios mayores.
- Los overrides de dependencias deben justificarse por seguridad y validarse
  con `npm run build`.
