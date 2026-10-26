<script setup>
import { ref, computed, onMounted } from 'vue'
import PaisCard from './components/PaisCard.vue'
import { API_BASE, API_KEY, CAMPOS, LIMITE_POR_PAGINA, REGIONES } from './config.js'

// ─── Estado reactivo ────────────────────────────────────────────
const paises = ref([])            // lista de países que devuelve la API
const cargando = ref(true)        // true mientras se hace la petición
const error = ref('')             // mensaje de error si la API falla
const esDemo = ref(false)         // true si la API respondió con la key demo
const busqueda = ref('')          // texto del campo de búsqueda (v-model)
const regionSeleccionada = ref('') // región elegida en el <select> (v-model)
const orden = ref('nombre')       // criterio de orden (v-model)

// Integrantes del equipo (se muestran en el pie con v-for)
const integrantes = [
  'Fernández Culebro Sebastián Ali',
  'Gabriel Alejandro Cruz Guillen',
  'Ricardo Francisco Pinto Velasco',
]

// ─── Consumo de la API con fetch() ─────────────────────────────
// Pide una "página" de países (la API pagina con limit y offset)
async function obtenerPagina(offset) {
  const url =
    `${API_BASE}?limit=${LIMITE_POR_PAGINA}&offset=${offset}` +
    `&response_fields=${CAMPOS}&api-key=${API_KEY}`

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`)
  }
  return respuesta.json()
}

// Descarga todos los países recorriendo las páginas
async function cargarPaises() {
  cargando.value = true
  error.value = ''

  try {
    let offset = 0
    let hayMas = true
    const todos = []

    while (hayMas) {
      const json = await obtenerPagina(offset)
      const datos = json.data

      if (datos._demo) esDemo.value = true

      todos.push(...datos.objects.map(normalizarPais))

      hayMas = Boolean(datos.meta?.more)
      offset += LIMITE_POR_PAGINA
    }

    paises.value = todos
  } catch (e) {
    console.error(e)
    error.value = 'No fue posible obtener los datos de la API'
  } finally {
    cargando.value = false
  }
}

// Convierte el objeto de la API en uno más sencillo para la vista
function normalizarPais(p) {
  const capital =
    p.capitals?.find((c) => c.attributes?.primary)?.name ||
    p.capitals?.[0]?.name ||
    'Sin capital'

  return {
    id: p.codes?.alpha_3 || p.names?.common,
    nombre: p.names?.translations?.spa?.common || p.names?.common,
    nombreIngles: p.names?.common,
    nombreOficial: p.names?.translations?.spa?.official || p.names?.official,
    bandera: p.flag?.url_svg || p.flag?.url_png,
    descripcionBandera: p.flag?.description || `Bandera de ${p.names?.common}`,
    capital,
    region: REGIONES[p.region] || p.region || 'Sin región',
    subregion: p.subregion || '',
    poblacion: p.population ?? 0,
  }
}

// La primera llamada a la API se hace al montar el componente
onMounted(() => {
  cargarPaises()
})

// ─── Filtro con v-model ────────────────────────────────────────
// Quita acentos y pasa a minúsculas para comparar sin problemas
const limpiar = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const regiones = computed(() =>
  [...new Set(paises.value.map((p) => p.region))].sort()
)

const paisesFiltrados = computed(() => {
  const texto = limpiar(busqueda.value)

  const resultado = paises.value.filter((p) => {
    const coincideTexto =
      !texto ||
      limpiar(p.nombre).includes(texto) ||
      limpiar(p.nombreIngles).includes(texto) ||
      limpiar(p.region).includes(texto)

    const coincideRegion =
      !regionSeleccionada.value || p.region === regionSeleccionada.value

    return coincideTexto && coincideRegion
  })

  return resultado.sort((a, b) =>
    orden.value === 'poblacion'
      ? b.poblacion - a.poblacion
      : a.nombre.localeCompare(b.nombre, 'es')
  )
})

function limpiarFiltros() {
  busqueda.value = ''
  regionSeleccionada.value = ''
  orden.value = 'nombre'
}
</script>

<template>
  <header class="encabezado">
    <h1>🌎 Explorador de Países</h1>
    <p class="subtitulo">Datos obtenidos en tiempo real de la API REST Countries</p>
  </header>

  <main class="contenedor">
    <!-- Controles de búsqueda y filtrado (v-model) -->
    <section class="controles">
      <input
        v-model="busqueda"
        type="search"
        class="campo"
        placeholder="Buscar país por nombre o región..."
        aria-label="Buscar país"
      />

      <select v-model="regionSeleccionada" class="campo" aria-label="Filtrar por región">
        <option value="">Todas las regiones</option>
        <option v-for="region in regiones" :key="region" :value="region">
          {{ region }}
        </option>
      </select>

      <select v-model="orden" class="campo" aria-label="Ordenar">
        <option value="nombre">Ordenar por nombre</option>
        <option value="poblacion">Ordenar por población</option>
      </select>
    </section>

    <!-- Aviso cuando se usa la key de demostración -->
    <p v-if="esDemo && !cargando" class="aviso">
      ⚠️ Estás usando la API key de demostración: la API solo devuelve un país de ejemplo.
      Configura tu propia key gratuita para ver todos los países.
    </p>

    <!-- Estados de la aplicación (v-if / v-else-if / v-else) -->
    <div v-if="cargando" class="estado">
      <div class="spinner"></div>
      <p>Cargando países...</p>
    </div>

    <div v-else-if="error" class="estado estado-error">
      <p>❌ {{ error }}</p>
      <button class="boton" @click="cargarPaises">Reintentar</button>
    </div>

    <div v-else-if="paisesFiltrados.length === 0" class="estado">
      <p>🔍 No se encontraron países que coincidan con "{{ busqueda }}"</p>
      <button class="boton" @click="limpiarFiltros">Limpiar filtros</button>
    </div>

    <template v-else>
      <p class="contador">
        Mostrando <strong>{{ paisesFiltrados.length }}</strong> de {{ paises.length }} países
      </p>

      <!-- Lista de países (v-for) -->
      <section class="rejilla">
        <PaisCard v-for="pais in paisesFiltrados" :key="pais.id" :pais="pais" />
      </section>
    </template>
  </main>

  <footer class="pie">
    <p>Proyecto Unidad 3 · Programación Web · Grupo S5A</p>
    <p>
      Equipo:
      <span v-for="(nombre, i) in integrantes" :key="nombre">
        {{ nombre }}<template v-if="i < integrantes.length - 1">, </template>
      </span>
    </p>
  </footer>
</template>
