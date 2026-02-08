import i18n from '@/i18n'
import { nextTick } from 'vue'

const Translation = {
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(',')
  },

  get defaultLocale() {
    return import.meta.env.VITE_DEFAULT_LOCALE
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  isLocaleSupported(locale) {
    return Translation.supportedLocales.includes(locale)
  },

  getUserLocale() {
    const locale =
      window.navigator.language ||
      window.navigator.userLanguage ||
      Translation.defaultLocale

    return {
      locale,
      localeNoRegion: locale.split('-')[0],
    }
  },

  getPersistedLocale() {
    const persistedLocale = localStorage.getItem('user-locale')

    if (Translation.isLocaleSupported(persistedLocale)) {
      return persistedLocale
    }
    return null
  },

  guessDefaultLocale() {
    const userPersistedLocale = Translation.getPersistedLocale()

    if (userPersistedLocale) {
      return userPersistedLocale
    }

    const userPreferredLocale = Translation.getUserLocale()

    if (Translation.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale
    }
    if (Translation.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion
    }

    return Translation.defaultLocale
  },

  async switchLanguage(newLocale) {
    await Translation.loadLocaleMessages(newLocale)
    Translation.currentLocale = newLocale
    document.querySelector('html').setAttribute('lang', newLocale)
    localStorage.setItem('user-locale', newLocale)
  },

  async loadLocaleMessages(locale) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`@/i18n/locales/${locale}.json`)
      i18n.global.setLocaleMessage(locale, messages.default)
    }

    return nextTick()
  },

  async routeMiddleware(to, _from, next) {
    // Initialize with the default locale without redirecting
    await Translation.switchLanguage(Translation.guessDefaultLocale())
    return next()
  },

  /*
  // Former version of routeMiddleware with locale-based routing
  async routeMiddlewareWithLocale(to, _from, next) {
    const paramLocale = to.params.locale

    if (!Translation.isLocaleSupported(paramLocale)) {
        return next(Translation.guessDefaultLocale())
    }

    await Translation.switchLanguage(paramLocale)

    return next()
  }
  */
}

export default Translation
