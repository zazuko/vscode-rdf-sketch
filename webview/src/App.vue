<template>
  <div class="w-full h-full">
    <GraphView v-if="dataset" :dataset="dataset" :env="env" />
    <div v-else class="mt-4 p-4 bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import GraphView from '@zazuko/rdf-sketch/src/components/GraphView.vue'

import N3Parser from '@rdfjs/parser-n3'
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import stringToStream from 'string-to-stream'
import rdf from 'rdf-ext'

for (const [prefix, uri] of Object.entries(prefixes)) {
  rdf.prefixes.set(prefix, rdf.namedNode(uri))
}

const defaultEnv = {
  shrink (term) {
    return rdf.prefixes.shrink(term) || term.value
  }
}

export default defineComponent({
  name: 'App',
  components: { GraphView },

  setup () {
    const dataset = ref()
    const error = ref('')

    onMounted(async () => {
      const content = loadContent()
      try {
        dataset.value = await parseString(content)
      } catch (e) {
        console.error(e)
        error.value = e.toString()
      }
    })

    return {
      dataset,
      env: defaultEnv,
      error,
    }
  }
})

function loadContent () {
  const contentElement = document.querySelector('[data-content]')
  return contentElement.value
}

async function parseString (str) {
  const parser = new N3Parser()
  const stream = parser.import(stringToStream(str))
  return rdf.dataset().import(stream)
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
}

.link {
  stroke: white;
}
</style>
