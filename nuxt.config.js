export default {
  // loading: '~/components/loading.vue',
  router: {
    extendRoutes(routes) {
      routes.push({
        path: '/',
        component: '~/pages/auth/login',
      })
    },
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  // server: {
  //   port: process.env.PORT || 3000, // default: 3000
  //   host: '0.0.0.0', // default: localhost
  // },
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  ssr: false,
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Cyberquote',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/small.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Oxygen&display=swap',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/scss/app.scss',
    '~layouts/global.css',
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    '~/assets/main.css',
    '~/assets/fonts/quicksand.css',
    '~/assets/css/styles.css',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/fireauth.js',
    '~/plugins/fakeauth.js',
    '~/plugins/simplebar.js',
    '~/plugins/vue-click-outside.js',
    '~/plugins/vuelidate.js',
    '~/plugins/draggable.js',
    '~/plugins/vue-slidebar.js',
    '~/plugins/tour.js',
    '~/plugins/vue-lightbox.js',
    '~/plugins/mask.js',
    '~/plugins/quill-editor.js',
    '~/plugins/chartist.js',
    '~/plugins/vue-googlemap.js',
    '~/plugins/string-filter',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/eslint-module'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    'nuxt-i18n',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],
  axios: {
    baseURL: process.env.API_URL, // Used as fallback if no runtime config is provided
  },
  i18n: {
    locales: ['en', 'fr', 'es', 'ar'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: require('./locales/en.json'),
        fr: require('./locales/fr.json'),
        es: require('./locales/es.json'),
        ar: require('./locales/ar.json'),
        zh: require('./locales/zh.json'),
      },
    },
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/dashboard',
    },
    strategies: {
      local: {
        token: {
          property: 'data.token',
          required: true,
          type: 'Bearer',
        },
        user: {
          property: 'success',
          // autoFetch: true,
        },
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
          },
          logout: {},
          user: { url: '/master/postag', method: 'get' },
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  publicRuntimeConfig: {
    API_KEY: process.env.TOKEN_API,
  },
}
