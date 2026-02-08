/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#089AD9',
          secondary: '#68A527',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#ffffff',
          'background-2': '#f5f5f5',
          'sold-out': '#585b79',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#067EB1',
          secondary: '#3E6317',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#121212',
          'background-2': '#121212',
          'sold-out': '#585b79',
        },
      },
    },
    defaultTheme: 'light',
  },
})
