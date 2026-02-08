import { Strings } from '../utils/Strings'
import type { Commune, Departement } from './State'

// Ce type (dont il est impossible de créer une instance)
// permet de ne pas simplement faire un alias de string, et ainsi
// éviter qu'un `string` puisse être utilisé là où ce type est attendu.
// L'utilisation de `as` permet de caster des strings en ce type.
type NormalizedSearch = string & { __normalizedSearch: undefined }

export interface CommuneAutocomplete {
  n: string // nom
  z: string // code postal
  c: string // code insee
  d: string // code departement
  g: string // "longitude,latitude"
}
export interface OutreMerAutocomplete {
  n: string // nom
  z: string // code postal
  c: string // code insee
}

export class Autocomplete {
  private webBaseUrl: string

  constructor(
    webBaseUrl: string,
    private getDepartementsDisponibles: () => Promise<Departement[]>
  ) {
    this.webBaseUrl = webBaseUrl.endsWith('/') ? webBaseUrl : `${webBaseUrl}/`
  }

  async findCommune(
    codePostal: string,
    codeInsee: string
  ): Promise<Commune | undefined> {
    const communes = await this.getMatchingCommunes(this.normalize(codePostal))
    return communes.find(
      commune => commune.codePostal === codePostal && commune.code === codeInsee
    )
  }

  async findDepartement(
    codeDepartement: string
  ): Promise<Departement | undefined> {
    const departements = await this.getMatchingDepartements(
      this.normalize(codeDepartement)
    )
    return departements.find(
      departement => departement.code_departement === codeDepartement
    )
  }

  async suggest(prefix: string): Promise<Array<Departement | Commune>> {
    const term = this.normalize(prefix)
    if (prefix.length === 0) {
      return this.getDepartements()
    }
    if (prefix.length === 1) {
      return this.getMatchingDepartements(term)
    }
    const departements = await this.getMatchingDepartements(term)
    const communes = await this.getMatchingCommunes(term)
    return [...departements, ...communes]
  }

  private async getMatchingDepartements(
    term: NormalizedSearch
  ): Promise<Departement[]> {
    const departements = await this.getDepartements()
    return departements.filter(departement => {
      return (
        departement.code_departement.startsWith(term) ||
        this.normalize(departement.nom_departement).includes(term)
      )
    })
  }

  private async getMatchingCommunes(
    term: NormalizedSearch
  ): Promise<Array<Commune>> {
    const prefixMatch = await this.getLongestPrefixMatch(term)
    if (!prefixMatch) {
      return []
    }
    const communesWithPrefix = await this.getAutocompleteOptions(prefixMatch)
    return communesWithPrefix.filter(commune => {
      return (
        commune.codePostal.includes(term) ||
        this.normalize(commune.nom).includes(term)
      )
    })
  }

  private mapAutocompleteToCommune(
    option: CommuneAutocomplete | OutreMerAutocomplete
  ): Commune | undefined {
    if ('g' in option && 'd' in option) {
      const [longitude, latitude] = option.g.split(',').map(Number)
      return {
        nom: option.n,
        code: option.c,
        codePostal: option.z,
        codeDepartement: option.d,
        latitude,
        longitude,
      } as Commune
    } else {
      /* FIXME retourner une CommuneOutreMer
       * Pour l'instant nous ignorons les communautés d'outre-mer
       * car ça fait planter l'application, mais ça n'est pas gentil pour eux.
       */
      return undefined
    }
  }

  private async getLongestPrefixMatch(
    term: NormalizedSearch
  ): Promise<NormalizedSearch | undefined> {
    const prefixes = await this.getAutocompletePrefixes()
    for (let size = term.length; size > 0; --size) {
      // Par construction, une sous partie d'un NormalizedSearch est un NormalizedSearch
      const subPrefix = term.slice(0, Math.max(0, size)) as NormalizedSearch
      if (prefixes.has(subPrefix)) {
        return subPrefix
      }
    }
    return undefined
  }

  private async getDepartements(): Promise<Departement[]> {
    return this.getDepartementsDisponibles()
  }

  private async getAutocompletePrefixes(): Promise<Set<NormalizedSearch>> {
    const response = await window.fetch(`${this.webBaseUrl}autocompletes.json`)
    // `communes-import.ts` utilise Strings.toFullTextNormalized ce qui
    // garantit que les préfixes contenus dans ce fichier ont été normalisés
    const prefixes = (await response.json()) as NormalizedSearch[]
    return new Set(prefixes)
  }

  private async getAutocompleteOptions(
    name: NormalizedSearch
  ): Promise<Commune[]> {
    const response = await window.fetch(
      `${this.webBaseUrl}autocomplete-cache/tuf_${name}.json`
    )
    const { communes } = (await response.json()) as {
      communes: CommuneAutocomplete[]
    }
    return communes
      .map(this.mapAutocompleteToCommune)
      .filter(commune => commune !== undefined) as Commune[]
  }

  private normalize(term: string): NormalizedSearch {
    return Strings.toFullTextNormalized(term) as NormalizedSearch
  }
}
