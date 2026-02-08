/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import i18n from './i18n'

// Import global styles for card-action-button
import '@/styles/card-action-button.scss'

const app = createApp(App)

registerPlugins(app)

app.use(i18n)
app.mount('#app')
