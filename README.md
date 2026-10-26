# 🌎 Explorador de Países

Segundo proyecto de la Unidad 3: aplicación web con **Vue 3** que consume la
[API REST Countries v5](https://restcountries.com/docs/countries) y muestra los
países del mundo con su bandera, nombre, capital, región y población.

## Funcionalidades

| Requisito | Dónde está |
|---|---|
| Petición asíncrona con `fetch()` | `src/App.vue` → `obtenerPagina()` |
| Primera llamada dentro de `onMounted()` | `src/App.vue` |
| Datos en variables reactivas `ref()` | `paises`, `cargando`, `error`, `busqueda` |
| `v-for` para listar países | `src/App.vue` (rejilla) y `<select>` de regiones |
| `v-if` / `v-else-if` / `v-else` para estados | Cargando, error, sin resultados, lista |
| `v-model` para filtrar | Buscador por nombre/región, select de región y orden |
| `v-bind` | `:src`, `:alt`, `:key`, `:pais`, `:class` en `PaisCard.vue` |
| Manejo de errores `try / catch` | `cargarPaises()` |

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # y pega tu API key
npm run dev
```

> Sin key propia se usa la key de demostración `rc_live_demo`, que solo
> devuelve un país de ejemplo (Canadá).

## API key y CORS

La API bloquea peticiones desde el navegador si el dominio no está autorizado
en la key. En <https://restcountries.com/api-keys> agrega como *allowed hostnames*:

```
localhost, TU-USUARIO.github.io
```

## Publicación

El workflow `.github/workflows/deploy.yml` compila y publica el sitio en
GitHub Pages en cada `push` a `main`. La key se guarda como secret
`VITE_RC_API_KEY` en *Settings → Secrets and variables → Actions*.

## Tecnologías

Vue 3 (Composition API, `<script setup>`), Vite, GitHub Actions, GitHub Pages.
