# Supabase Setup

Este setup convierte CoKicks en un catalogo editable de forma segura.

## Variables

Copia `.env.example` a `.env.local` y llena:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ENABLE_ADMIN=true
```

`VITE_SUPABASE_ANON_KEY` puede estar en el frontend. La seguridad real vive en
Row Level Security y policies.

No incluyas emails personales en variables `VITE_*`: esas variables se
incorporan al JavaScript publico del sitio. El rol autorizado se determina en
la tabla privada `admin_users` mediante las reglas de Supabase.

## SQL

1. Crea un proyecto en Supabase.
2. Ve a SQL Editor.
3. Ejecuta `supabase/schema.sql`.
4. Crea tu usuario usando Auth.
5. Busca tu `auth.users.id`.
6. Inserta tu admin:

```sql
insert into public.admin_users (user_id, email)
values ('TU_USER_ID', 'TU_EMAIL');
```

## Seguridad

- Publico puede leer solo productos publicados.
- Solo admins autenticados pueden crear, editar o eliminar productos.
- Solo admins autenticados pueden subir, editar o eliminar fotos.
- La ruta admin no debe confiar en esconder URLs; debe validar sesion y rol.
- En `Authentication > Providers > Email`, desactiva `Allow new users to sign up`.
- En `Authentication > Users`, conserva solo los usuarios que quieras permitir.
  Para CoKicks, el unico usuario debe ser `alexsanzjr@gmail.com`.

## Activar admin en produccion

El admin no se publica por accidente. Para activarlo en un build debes definir:

```txt
VITE_ENABLE_ADMIN=true
```

La ruta seguira protegida por Supabase Auth y la tabla `admin_users`.
