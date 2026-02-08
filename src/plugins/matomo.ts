// @ts-ignore

import type { Router } from 'vue-router'

function matomoOptions(router: Router) {
  return {
    host: 'https://analytics.climatefresk.org',
    siteId: 12,
    trackerFileName: 'matomo',
    router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    enableHeartBeatTimer: false,
    heartBeatTimerInterval: 15,
    debug: false,
    userId: undefined,
    cookieDomain: undefined,
    domains: undefined,
    preInitActions: [],
  }
}

export { matomoOptions }

export { default as VueMatomo } from 'vue-matomo'
