import type { SearchType } from '../common/Conf'
import type { CodeTriCentre } from '../state/State'
import { Strings } from '../utils/Strings'

export const LANGUAGE_ALL = 'all'

/**
 * Encode an array of language codes into a URL segment.
 * An empty array or [LANGUAGE_ALL] means "all languages" → no segment.
 * Multiple codes are joined with a dot, e.g. `/lang-en.fr`.
 */
function buildLangSegment(languageCodes?: string[]): string {
  if (
    !languageCodes ||
    languageCodes.length === 0 ||
    languageCodes.includes(LANGUAGE_ALL)
  ) {
    return ''
  }
  return `/lang-${languageCodes.join('.')}`
}

/**
 * Parse a languageCode route param back into an array of codes.
 * If the param is absent/empty, returns [] (meaning "all").
 */
export function parseLangParam(languageCode: string | undefined): string[] {
  if (!languageCode) return []
  return languageCode.split('.').filter(Boolean)
}

export const rechercheDepartementDescriptor = {
  routerUrl:
    'dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline',
  routerUrlWithLang:
    'dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline/lang-:languageCode',
  urlGenerator: ({
    codeDepartement,
    nomDepartement,
    searchType,
    languageCodes,
  }: {
    codeDepartement: string
    nomDepartement: string
    searchType: SearchType
    languageCodes?: string[]
  }) => {
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/recherche-${searchType}/online-non${buildLangSegment(languageCodes)}`
  },
}

export const rechercheCommuneDescriptor = {
  routerUrl:
    'dpt:codeDpt-:nomDpt/commune:codeCommune-:codePostal-:nomCommune/recherche-:typeRecherche/en-triant-par-:codeTriCentre/online-:includesOnline',
  routerUrlWithLang:
    'dpt:codeDpt-:nomDpt/commune:codeCommune-:codePostal-:nomCommune/recherche-:typeRecherche/en-triant-par-:codeTriCentre/online-:includesOnline/lang-:languageCode',
  urlGenerator: ({
    codeDepartement,
    nomDepartement,
    codeCommune,
    codePostal,
    nomCommune,
    tri,
    searchType,
    languageCodes,
  }: {
    codeDepartement: string
    nomDepartement: string
    codeCommune: string
    codePostal: string
    nomCommune: string
    tri: CodeTriCentre
    searchType: SearchType
    languageCodes?: string[]
  }) => {
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/commune${codeCommune}-${codePostal}-${Strings.toReadableURLPathValue(nomCommune)}/recherche-${searchType}/en-triant-par-${tri}/online-non${buildLangSegment(languageCodes)}`
  },
}
