# CoKicks Security Model

CoKicks empieza como un catalogo estatico. En esta fase no hay base de datos,
login, panel administrativo real ni escritura desde el navegador.

## Reglas

- La informacion de contacto vive en `src/config/business.ts`.
- Los productos temporales viven en `src/data/products.ts`.
- Cambios de contacto o inventario requieren editar el codigo y desplegar una
  nueva version.
- La ruta `/admin` solo existe en desarrollo local mediante `import.meta.env.DEV`.
- No se debe publicar un admin funcional sin autenticacion real.

## Futuro Supabase

Cuando se conecte Supabase, el admin debe cumplir:

- Supabase Auth obligatorio.
- Solo emails autorizados pueden entrar al panel.
- Row Level Security activado en todas las tablas.
- Policies que permitan escritura solo a administradores.
- Storage privado o con policies estrictas para subir fotos.
- Ninguna clave secreta debe vivir en el frontend.
- Variables publicas `VITE_*` solo pueden contener claves anon/public.

## GitHub Pages

GitHub Pages servira el frontend estatico. No debe guardar credenciales ni
secretos. El dominio propio debe configurarse con HTTPS.
