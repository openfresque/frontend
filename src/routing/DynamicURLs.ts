import type { SearchType } from '../common/Conf'
import type { CodeTriCentre } from '../state/State'
import { Strings } from '../utils/Strings'

export const rechercheDepartementDescriptor = {
  routerUrl:
    'dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline',
  urlGenerator: ({
    codeDepartement,
    nomDepartement,
    searchType,
  }: {
    codeDepartement: string
    nomDepartement: string
    searchType: SearchType
  }) => {
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/recherche-${searchType}/online-non`
  },
}

export const rechercheCommuneDescriptor = {
  routerUrl:
    'dpt:codeDpt-:nomDpt/commune:codeCommune-:codePostal-:nomCommune/recherche-:typeRecherche/en-triant-par-:codeTriCentre/online-:includesOnline',
  urlGenerator: ({
    codeDepartement,
    nomDepartement,
    codeCommune,
    codePostal,
    nomCommune,
    tri,
    searchType,
  }: {
    codeDepartement: string
    nomDepartement: string
    codeCommune: string
    codePostal: string
    nomCommune: string
    tri: CodeTriCentre
    searchType: SearchType
  }) => {
    return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/commune${codeCommune}-${codePostal}-${Strings.toReadableURLPathValue(nomCommune)}/recherche-${searchType}/en-triant-par-${tri}/online-non`
  },
}
