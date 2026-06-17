# CoKicks Deploy

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

El build genera `dist/index.html` y copia ese archivo como `dist/404.html`
para que las rutas internas del catalogo funcionen al abrirse directo en
GitHub Pages.

## GitHub Pages

El workflow esta en `.github/workflows/deploy.yml`.

Si el sitio vive en un repositorio tipo:

```txt
https://usuario.github.io/cokicks/
```

configura el build con:

```bash
VITE_BASE_PATH=/cokicks/ npm run build
```

Si el sitio usa dominio propio como:

```txt
https://cokicks.com
```

usa:

```bash
VITE_BASE_PATH=/ npm run build
```

## Dominio propio

Cuando el dominio este listo, se puede añadir un archivo `public/CNAME` con:

```txt
cokicks.com
```

No se debe crear ese archivo hasta confirmar el dominio.
