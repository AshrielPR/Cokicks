# CoKicks Security Model

CoKicks usa Supabase Auth y Row Level Security para proteger el panel
administrativo y las operaciones de escritura.

## Reglas

- La informacion de contacto vive en `src/config/business.ts`.
- Los listings y sus fotos se gestionan desde Supabase mediante el panel
  protegido `/admin`.
- En produccion, `/admin` solo se registra si `VITE_ENABLE_ADMIN=true`.
- La ruta `/admin` no revela datos privados y requiere autenticacion para crear,
  editar o eliminar listings.

## Supabase

- Supabase Auth obligatorio.
- Solo usuarios incluidos en `admin_users` pueden administrar listings.
- Row Level Security activado en todas las tablas.
- Policies que permitan escritura solo a administradores.
- Las fotos de productos son publicas para que el catalogo pueda mostrarlas;
  solo administradores autenticados pueden subir, editar o borrar archivos.
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
