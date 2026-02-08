import type {
  CodeDepartement,
  SearchType,
  Workshop,
  WorkshopsParDepartement,
} from '../common/Conf'

import { RemoteConfig } from '../utils/RemoteConfig'
import { Strings } from '../utils/Strings'
import { Autocomplete } from './Autocomplete'

export type CodeTrancheAge = 'plus75ans'
export type TrancheAge = {
  codeTrancheAge: CodeTrancheAge
  libelle: string
}
export const TRANCHES_AGE: Map<CodeTrancheAge, TrancheAge> = new Map([
  ['plus75ans', { codeTrancheAge: 'plus75ans', libelle: 'Plus de 75 ans' }],
])

export type SearchRequest =
  | SearchRequest.ByCommune
  | SearchRequest.ByDepartement
export namespace SearchRequest {
  export type ByDepartement = {
    type: SearchType
    par: 'departement'
    departement: Departement
    tri: 'date'
    online: boolean
  }
  export function ByDepartement(
    departement: Departement,
    type: SearchType,
    online: boolean
  ): ByDepartement {
    return { type, par: 'departement', departement, tri: 'date', online }
  }
  export function isByDepartement(
    searchRequest: SearchRequest
  ): searchRequest is ByDepartement {
    return searchRequest.par === 'departement'
  }

  export type ByCommune = {
    type: SearchType
    par: 'commune'
    commune: Commune
    tri: 'distance'
    online: boolean
  }
  export function ByCommune(
    commune: Commune,
    type: SearchType,
    online: boolean
  ): ByCommune {
    return { type, par: 'commune', commune, tri: 'distance', online }
  }
  export function isByCommune(
    searchRequest: SearchRequest
  ): searchRequest is ByCommune {
    return searchRequest.par === 'commune'
  }
}

export type CodeTriCentre = 'date' | 'distance'

export type Departement = {
  code_departement: CodeDepartement
  nom_departement: string
  code_region: number
  nom_region: string
}

// Permet de convertir un nom de departement en un chemin d'url correct (remplacement des caractères
// non valides comme les accents ou les espaces)
export function libelleUrlPathDuDepartement(departement: Departement) {
  return Strings.toReadableURLPathValue(departement.nom_departement)
}

function convertDepartementForSort(codeDepartement: CodeDepartement) {
  switch (codeDepartement) {
    case '2A': {
      return '20A'
    }
    case '2B': {
      return '20B'
    }
    default: {
      return codeDepartement
    }
  }
}

const DEPARTEMENT_OM: Departement = {
  code_departement: 'om',
  nom_departement: "Collectivités d'Outremer",
  code_region: -1,
  nom_region: 'Outremer',
}

export interface Commune {
  code: string
  codePostal: string
  nom: string
  codeDepartement: string
  latitude: number
  longitude: number
}
export type CommunesParAutocomplete = Map<string, Commune[]>

// Permet de convertir un nom de departement en un chemin d'url correct (remplacement des caractères
// non valides comme les accents ou les espaces)
export function libelleUrlPathDeCommune(commune: Commune) {
  return Strings.toReadableURLPathValue(commune.nom)
}

export interface AutocompleteItem {
  value: number
  title: string
  props: Commune | Departement
}

export type SearchTypeConfig = {
  pathParam: string
  standardTabSelected: boolean
  excludeAppointmentByPhoneOnly: boolean
  jourSelectionnable: boolean
  theme: 'standard' | 'highlighted'
}
const SEARCH_TYPE_CONFIGS: {
  [type in Exclude<SearchType, 'all'>]: SearchTypeConfig & { type: type }
} = {
  standard: {
    type: 'standard',
    pathParam: 'standard',
    standardTabSelected: true,
    excludeAppointmentByPhoneOnly: false,
    jourSelectionnable: true,
    theme: 'standard',
  },
  atelier: {
    type: 'atelier',
    pathParam: 'atelier',
    standardTabSelected: true,
    excludeAppointmentByPhoneOnly: false,
    jourSelectionnable: true,
    theme: 'standard',
  },
  formation: {
    type: 'formation',
    pathParam: 'formation',
    standardTabSelected: true,
    excludeAppointmentByPhoneOnly: false,
    jourSelectionnable: true,
    theme: 'standard',
  },
  junior: {
    type: 'junior',
    pathParam: 'junior',
    standardTabSelected: true,
    excludeAppointmentByPhoneOnly: false,
    jourSelectionnable: true,
    theme: 'standard',
  },
}
export function searchTypeConfigFromPathParam(
  pathParams: Record<string, string>
): SearchTypeConfig & { type: SearchType } {
  const config = Object.values(SEARCH_TYPE_CONFIGS).find(
    config => pathParams && config.pathParam === pathParams.typeRecherche
  )
  if (config) {
    return config
  }
  throw new Error(`No config found for path param: ${pathParams.typeRecherche}`)
}
export function searchTypeConfigFromSearch(
  searchRequest: SearchRequest | void,
  fallback: Exclude<SearchType, 'all'>
) {
  return searchTypeConfigFor(
    searchRequest
      ? (searchRequest.type as Exclude<SearchType, 'all'>)
      : fallback
  )
}
export function searchTypeConfigFor(
  searchType: Exclude<SearchType, 'all'>
): SearchTypeConfig & { type: SearchType } {
  return SEARCH_TYPE_CONFIGS[searchType]
}

export class State {
  public static get current(): State {
    return new State()
  }

  private static DEPARTEMENT_VIDE: Departement = {
    code_departement: '',
    code_region: 0,
    nom_departement: '',
    nom_region: '',
  }

  private static COMMUNE_VIDE: Commune = {
    code: '',
    codeDepartement: '',
    codePostal: '',
    latitude: 0,
    longitude: 0,
    nom: '',
  }

  readonly autocomplete: Autocomplete

  private constructor() {
    const webBaseUrl = import.meta.env.BASE_URL
    this.autocomplete = new Autocomplete(webBaseUrl, () =>
      this.departementsDisponibles()
    )
  }

  async allWorkshops(): Promise<WorkshopsParDepartement> {
    const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator()
    const workshops: Workshop[] = await fetch(urlGenerator.workshops()).then(
      resp => resp.json()
    )
    return {
      workshopsDisponibles: workshops,
      codeDepartements: [],
      derniereMiseAJour:
        workshops.length > 0
          ? workshops[0].scrape_date
          : new Date().toISOString(),
    }
  }

  async workshopsPour(
    codesDepartements: CodeDepartement[]
  ): Promise<WorkshopsParDepartement> {
    const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator()
    const workshops: Workshop[] = await fetch(urlGenerator.workshops()).then(
      resp => resp.json()
    )

    const workshopsParDepartement: WorkshopsParDepartement = {
      workshopsDisponibles: workshops.filter(
        (workshop: Workshop) =>
          workshop.online || codesDepartements.includes(workshop.department)
      ),
      codeDepartements: codesDepartements,
      derniereMiseAJour:
        workshops.length > 0
          ? workshops[0].scrape_date
          : new Date().toISOString(),
    }

    return workshopsParDepartement
  }

  async departementsDisponibles(): Promise<Departement[]> {
    const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator()
    const resp = await fetch(urlGenerator.listDepartements())
    const departements: Departement[] = await resp.json()

    if (
      !departements.find(
        d => d.code_departement === DEPARTEMENT_OM.code_departement
      )
    ) {
      // The OM departement is missing in back-end departements.json.
      departements.push(DEPARTEMENT_OM)
    }

    return departements.sort((d1, d2) =>
      convertDepartementForSort(d1.code_departement).localeCompare(
        convertDepartementForSort(d2.code_departement)
      )
    )
  }

  async chercheDepartementParCode(code: string): Promise<Departement> {
    const deps = await this.departementsDisponibles()
    return (
      deps.find(dep => dep.code_departement === code) || State.DEPARTEMENT_VIDE
    )
  }

  async chercheCommuneParCode(
    codePostal: string,
    codeCommune: string
  ): Promise<Commune> {
    const commune = await this.autocomplete.findCommune(codePostal, codeCommune)
    return commune || State.COMMUNE_VIDE
  }
}

export {
  TYPE_RECHERCHE_PAR_DEFAUT,
  type CodeDepartement,
  type ISODateString,
  type SearchType,
  type Workshop,
  type WorkshopsParDepartement,
} from '../common/Conf'
