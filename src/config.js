// URL base de la API REST Countries (versión 5)
export const API_BASE = 'https://api.restcountries.com/countries/v5'

// API key. Se lee de la variable de entorno VITE_RC_API_KEY
// (archivo .env.local en tu compu, o secret de GitHub Actions al publicar).
// Si no existe, se usa la key de demostración del enunciado.
export const API_KEY = import.meta.env.VITE_RC_API_KEY || 'rc_live_demo'

// Campos que pedimos a la API para no descargar información innecesaria
export const CAMPOS =
  'names.common,names.official,names.translations,capitals,flag.url_png,flag.url_svg,flag.emoji,flag.description,region,subregion,population,codes.alpha_3'

// El plan gratuito permite máximo 100 países por petición
export const LIMITE_POR_PAGINA = 100

// Traducción de las regiones que devuelve la API
export const REGIONES = {
  Africa: 'África',
  Americas: 'América',
  Antarctic: 'Antártida',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceanía',
}
