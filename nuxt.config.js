
const port = process.env.PORT || 8080
const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1'

module.exports = {
  mode: 'universal',
  server: {
    port,
    host: SERVER_HOST
  },
  /*
  ** Headers of the page
  */
  env: {
    APP_ID: process.env.APP_ID || `http://localhost:${port}`,
    PORT_LIVE_QUERY: process.env.PORT_LIVE_QUERY || 2337,
    HOST_URL: process.env.HOST_URL || 'localhost',
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.jpg' },
      { rel: 'stylesheet', href: '/assets/css/main.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/parse', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
