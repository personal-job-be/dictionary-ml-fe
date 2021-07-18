<script>
import Error404 from '~/pages/extras/404.vue'

/**
 * Error layout
 */
export default {
  name: 'NuxtError',
  components: {
    Error404,
  },
  layout: 'auth',
  data() {
    return {}
  },
}
</script>

<template>
  <div class="nuxt-error">
    <Error404 />
  </div>
</template>
