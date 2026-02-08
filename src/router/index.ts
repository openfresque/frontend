/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router'
// Composables
import Translation from '@/i18n/translation'

// Import your components
import Apropos from '@/pages/Apropos.vue'
import Carte from '@/pages/Carte.vue'
import FindAFresk from '@/pages/FindAFresk.vue'
import Index from '@/pages/index.vue'
import LocalGroups from '@/pages/LocalGroups.vue'
import Mentions from '@/pages/Mentions.vue'
import SearchResults from '@/pages/SearchResults.vue'
import TalkAboutIt from '@/pages/TalkAboutIt.vue'
import Taskforce from '@/pages/Taskforce.vue'
import {
  rechercheCommuneDescriptor,
  rechercheDepartementDescriptor,
} from '@/routing/DynamicURLs'

// Route constants
export const ROUTE_FIND_A_FRESK = 'findAFresk' as const
export const ROUTE_MAP = 'map' as const
export const ROUTE_ABOUT = 'about' as const
export const ROUTE_LEGAL = 'legal' as const
export const ROUTE_SEARCH_DPT = 'searchDpt' as const
export const ROUTE_SEARCH_CITY = 'searchCom' as const
export const ROUTE_TALK_ABOUT_IT = 'talkAboutIt' as const
export const ROUTE_TASKFORCE = 'taskforce' as const
export const ROUTE_LOCAL_GROUPS = 'localGroups' as const

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // path: '/:locale?',
      path: '/',
      component: () => import('@/layouts/default.vue'),
      beforeEnter: Translation.routeMiddleware,
      children: [
        {
          path: '',
          name: 'home',
          component: Index,
        },
        {
          path: 'find-a-fresk',
          name: ROUTE_FIND_A_FRESK,
          component: FindAFresk,
          alias: 'find-a-workshop',
        },
        {
          path: 'carte',
          name: ROUTE_MAP,
          component: Carte,
        },
        {
          path: 'lets-talk-about-it',
          name: ROUTE_TALK_ABOUT_IT,
          component: TalkAboutIt,
        },
        {
          path: 'taskforce',
          name: ROUTE_TASKFORCE,
          component: Taskforce,
        },
        {
          path: 'local-groups',
          name: ROUTE_LOCAL_GROUPS,
          component: LocalGroups,
        },
        {
          path: 'a-propos',
          name: ROUTE_ABOUT,
          component: Apropos,
        },
        {
          path: 'mentions-legales',
          name: ROUTE_LEGAL,
          component: Mentions,
        },
        {
          path: rechercheDepartementDescriptor.routerUrl,
          name: ROUTE_SEARCH_DPT,
          component: SearchResults,
          props: true,
        },
        {
          path: rechercheCommuneDescriptor.routerUrl,
          name: ROUTE_SEARCH_CITY,
          component: SearchResults,
          props: true,
        },
      ],
    },
  ],
})

// Error handling for dynamic imports
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
