import type { SearchType } from '../common/Conf'
import type { CodeTriCentre } from '../state/State'
import { Strings } from '../utils/Strings'

export const LANGUAGE_ALL = 'all'

export const rechercheDepartementDescriptor = {
  routerUrl:
    'dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline',
  routerUrlWithLang:
    'dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline/lang-:languageCode',
  urlGenerator: ({
    codeDepartement,
    nomDepartement,
    searchType,
    languageCode,
  }: {
    codeDepartement: string
    nomDepartement: string
    searchType: SearchType
    languageCode?: string
  }) => {
    const langSegment =
      languageCode && languageCode !== LANGUAGE_ALL
        ? `/lang-${languageCode}`
        : ''
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/recherche-${searchType}/online-non${langSegment}`
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
    languageCode,
  }: {
    codeDepartement: string
    nomDepartement: string
    codeCommune: string
    codePostal: string
    nomCommune: string
    tri: CodeTriCentre
    searchType: SearchType
    languageCode?: string
  }) => {
    const langSegment =
      languageCode && languageCode !== LANGUAGE_ALL
        ? `/lang-${languageCode}`
        : ''
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/commune${codeCommune}-${codePostal}-${Strings.toReadableURLPathValue(nomCommune)}/recherche-${searchType}/en-triant-par-${tri}/online-non${langSegment}`
  },
}
