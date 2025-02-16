export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@scalar/nuxt'],
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  scalar: {
    darkMode: true,
    hideModels: false,
    hideDownloadButton: false,
    metaData: {
      title: 'API Documentation by Scalar',
    },
    proxyUrl: 'https://proxy.scalar.com',
    searchHotKey: 'k',
    showSidebar: true,
    pathRouting: {
      basePath: '/docs',
    },
  },
})
