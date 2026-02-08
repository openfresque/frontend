/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-matomo' {
  import type { Plugin } from 'vue'
  const VueMatomo: Plugin
  export default VueMatomo
}
