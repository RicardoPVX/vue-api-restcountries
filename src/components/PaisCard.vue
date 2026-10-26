<<script setup>
import { computed } from 'vue'

// El componente recibe un país ya normalizado desde App.vue
const props = defineProps({
  pais: { type: Object, required: true },
})

// Formatea la población con separadores de miles (ej. 41,798,407)
const poblacionFormateada = computed(() =>
  props.pais.poblacion.toLocaleString('es-MX')
)

// Etiqueta de tamaño según población, usada para la clase dinámica (v-bind)
const tamano = computed(() => {
  const p = props.pais.poblacion
  if (p >= 100_000_000) return 'grande'
  if (p >= 10_000_000) return 'mediano'
  return 'pequeno'
})
</script>

<template>
  <article class="tarjeta">
    <!-- v-bind: la URL y el texto alternativo vienen de la API -->
    <img
      :src="pais.bandera"
      :alt="pais.descripcionBandera"
      :title="pais.nombreOficial"
      class="bandera"
      loading="lazy"
    />

    <div class="cuerpo">
      <h2 class="nombre">{{ pais.nombre }}</h2>

      <dl class="datos">
        <div>
          <dt>Capital</dt>
          <dd>{{ pais.capital }}</dd>
        </div>
        <div>
          <dt>Región</dt>
          <dd>
            {{ pais.region }}
            <span v-if="pais.subregion" class="subregion">· {{ pais.subregion }}</span>
          </dd>
        </div>
        <div>
          <dt>Población</dt>
          <dd>
            {{ poblacionFormateada }}
            <span :class="['etiqueta', `etiqueta-${tamano}`]">{{ tamano === 'pequeno' ? 'pequeño' : tamano }}</span>
          </dd>
        </div>
      </dl>
      <div v-if="pais.wikipedia || pais.mapa" class="enlaces">
        <a v-if="pais.mapa" :href="pais.mapa" target="_blank" rel="noopener">📍 Ver mapa</a>
        <a v-if="pais.wikipedia" :href="pais.wikipedia" target="_blank" rel="noopener">📖 Wikipedia</a>
      </div>
    </div>
  </article>
</template>
