import i18n from '../i18n'

export type Atelier = {
  // Should be the same than PLATEFORMES' key
  code: string
  logo: string
  name: string
  description: string
  // Should we do promotion of this plateform ? for example on home screen ?
  // (typically, it may be not a good idea to promote the platform while JSON is not producing data for it yet)
  promoted: boolean
  website: string
}

export const ATELIERS: Record<number, Atelier> = {
  0: {
    code: 'FresqueNouveauxRecits',
    logo: '/assets/images/logo/logo_fresqueNouveauxRecits.webp',
    name: i18n.global.t('workshops.FresqueNouveauxRecits.name'),
    description: i18n.global.t('workshops.FresqueNouveauxRecits.description'),
    promoted: true,
    website: 'https://www.fresquedesnouveauxrecits.org/',
  },
  1: {
    code: 'FresqueOceane',
    logo: '/assets/images/logo/logo_fresqueOceane.webp',
    name: i18n.global.t('workshops.FresqueOceane.name'),
    description: i18n.global.t('workshops.FresqueOceane.description'),
    promoted: true,
    website: 'https://www.fresqueoceane.org/',
  },
  2: {
    code: 'FresqueBiodiversite',
    logo: '/assets/images/logo/logo_fresqueBiodiversite.svg',
    name: i18n.global.t('workshops.FresqueBiodiversite.name'),
    description: i18n.global.t('workshops.FresqueBiodiversite.description'),
    promoted: true,
    website: 'https://www.fresquedelabiodiversite.org/',
  },
  4: {
    code: 'FresqueAgriAlim',
    logo: '/assets/images/logo/logo_fresqueAgriAlim.webp',
    name: i18n.global.t('workshops.FresqueAgriAlim.name'),
    description: i18n.global.t('workshops.FresqueAgriAlim.description'),
    promoted: true,
    website: 'https://fresqueagrialim.org/',
  },
  3: {
    code: 'FresqueNumerique',
    logo: '/assets/images/logo/logo_fresqueNumerique.png',
    name: i18n.global.t('workshops.FresqueNumerique.name'),
    description: i18n.global.t('workshops.FresqueNumerique.description'),
    promoted: true,
    website: 'https://www.fresquedunumerique.org/',
  },
  7: {
    code: 'FresqueMobilite',
    logo: '/assets/images/logo/logo_fresqueMobilite.png',
    name: i18n.global.t('workshops.FresqueMobilite.name'),
    description: i18n.global.t('workshops.FresqueMobilite.description'),
    promoted: true,
    website: 'https://fresquedelamobilite.org/',
  },
  5: {
    code: 'FresqueAlimentation',
    logo: '/assets/images/logo/logo_fresqueAlimentation.webp',
    name: i18n.global.t('workshops.FresqueAlimentation.name'),
    description: i18n.global.t('workshops.FresqueAlimentation.description'),
    promoted: true,
    website: 'https://fresquealimentation.org/',
  },
  9: {
    code: 'OGRE',
    logo: '/assets/images/logo/logo_OGRE.png',
    name: i18n.global.t('workshops.OGRE.name'),
    description: i18n.global.t('workshops.OGRE.description'),
    promoted: true,
    website: 'https://atelierogre.org/',
  },
  6: {
    code: 'FresqueConstruction',
    logo: '/assets/images/logo/logo_fresqueConstruction.webp',
    name: i18n.global.t('workshops.FresqueConstruction.name'),
    description: i18n.global.t('workshops.FresqueConstruction.description'),
    promoted: true,
    website: 'https://www.fresquedelaconstruction.org/',
  },
  8: {
    code: 'FresqueSexisme',
    logo: '/assets/images/logo/logo_fresqueSexisme.png',
    name: i18n.global.t('workshops.FresqueSexisme.name'),
    description: i18n.global.t('workshops.FresqueSexisme.description'),
    promoted: true,
    website: 'https://fresque-du-sexisme.org/',
  },
  10: {
    code: 'AtelierInventonsNosViesBasCarbone',
    logo: '/assets/images/logo/logo_INVBC.webp',
    name: i18n.global.t('workshops.AtelierInventonsNosViesBasCarbone.name'),
    description: i18n.global.t(
      'workshops.AtelierInventonsNosViesBasCarbone.description'
    ),
    promoted: true,
    website: 'https://www.nosviesbascarbone.org/latelier/',
  },
  11: {
    code: 'FresqueDeLeau',
    logo: '/assets/images/logo/logo_fresqueDeLeau.webp',
    name: i18n.global.t('workshops.FresqueDeLeau.name'),
    description: i18n.global.t('workshops.FresqueDeLeau.description'),
    promoted: true,
    website: 'https://www.eaudyssee.org/',
  },
  12: {
    code: 'FutursProches',
    logo: '/assets/images/logo/logo_FutursProches.webp',
    name: i18n.global.t('workshops.FutursProches.name'),
    description: i18n.global.t('workshops.FutursProches.description'),
    promoted: true,
    website: 'https://futursproches.com/',
  },
  13: {
    code: 'FresqueDiversite',
    logo: '/assets/images/logo/logo_fresqueDiversite.webp',
    name: i18n.global.t('workshops.FresqueDiversite.name'),
    description: i18n.global.t('workshops.FresqueDiversite.description'),
    promoted: true,
    website: 'https://fresquedeladiversite.org/',
  },
  14: {
    code: 'FresqueDuTextile',
    logo: '/assets/images/logo/logo_FresqueTextile.webp',
    name: i18n.global.t('workshops.FresqueDuTextile.name'),
    description: i18n.global.t('workshops.FresqueDuTextile.description'),
    promoted: true,
    website: 'https://greendonut.org/textile/',
  },
  15: {
    code: 'FresqueDesDechets',
    logo: '/assets/images/logo/logo_FresqueDechets.webp',
    name: i18n.global.t('workshops.FresqueDesDechets.name'),
    description: i18n.global.t('workshops.FresqueDesDechets.description'),
    promoted: true,
    website: 'https://greendonut.org/dechets/',
  },
  16: {
    code: 'PuzzleClimat',
    logo: '/assets/images/logo/logo_puzzleClimat.webp',
    name: i18n.global.t('workshops.PuzzleClimat.name'),
    description: i18n.global.t('workshops.PuzzleClimat.description'),
    promoted: true,
    website: 'https://www.puzzleclimat.org/',
  },
  17: {
    code: 'FresqueFinance',
    logo: '/assets/images/logo/logo_fresqueFinance.webp',
    name: i18n.global.t('workshops.FresqueFinance.name'),
    description: i18n.global.t('workshops.FresqueFinance.description'),
    promoted: true,
    website: 'https://www.linkedin.com/company/fresque-de-la-finance/',
  },
  18: {
    code: 'FresqueRSE',
    logo: '/assets/images/logo/logo_fresqueRSE.webp',
    name: i18n.global.t('workshops.FresqueRSE.name'),
    description: i18n.global.t('workshops.FresqueRSE.description'),
    promoted: true,
    website: 'https://fresquedelarse.org/',
  },
  19: {
    code: 'AtelierDesTransitionsUrbaines',
    logo: '/assets/images/logo/logo_atelierDesTransitionsUrbaines.webp',
    name: i18n.global.t('workshops.AtelierDesTransitionsUrbaines.name'),
    description: i18n.global.t(
      'workshops.AtelierDesTransitionsUrbaines.description'
    ),
    promoted: true,
    website: 'https://www.ateliertransitionsurbaines.org/',
  },
  100: {
    code: '2tonnes',
    logo: '/assets/images/logo/logo_2tonnes.webp',
    name: i18n.global.t('workshops.2tonnes.name'),
    description: i18n.global.t('workshops.2tonnes.description'),
    promoted: true,
    website: 'https://www.2tonnes.org/',
  },
  101: {
    code: 'AtelierCompteGouttes',
    logo: '/assets/images/logo/logo_atelier_compte_gouttes.avif',
    name: i18n.global.t('workshops.AtelierCompteGouttes.name'),
    description: i18n.global.t('workshops.AtelierCompteGouttes.description'),
    promoted: true,
    website: 'https://compte-gouttes.fr/',
  },
  102: {
    code: 'FresqueBenevolat',
    logo: '/assets/images/logo/logo_fresqueBenevolat.svg',
    name: i18n.global.t('workshops.FresqueBenevolat.name'),
    description: i18n.global.t('workshops.FresqueBenevolat.description'),
    promoted: true,
    website: 'https://www.jeveuxaider.gouv.fr/fresque-benevolat',
  },
  103: {
    code: 'FresquePlastique',
    logo: '/assets/images/logo/logo_fresquePlastique.webp',
    name: i18n.global.t('workshops.FresquePlastique.name'),
    description: i18n.global.t('workshops.FresquePlastique.description'),
    promoted: true,
    website: 'https://fresqueduplastique.fr/',
  },
  104: {
    code: 'CyberFresque',
    logo: '/assets/images/logo/logo_cyberFresque.png',
    name: i18n.global.t('workshops.CyberFresque.name'),
    description: i18n.global.t('workshops.CyberFresque.description'),
    promoted: true,
    website: 'https://www.eventbrite.fr/o/senscyb-89802295343',
  },
  200: {
    code: 'FresqueClimat',
    logo: '/assets/images/logo/logo_fresqueClimat.png',
    name: i18n.global.t('workshops.FresqueClimat.name'),
    description: i18n.global.t('workshops.FresqueClimat.description'),
    promoted: true,
    website: 'https://fresqueduclimat.org/',
  },
  300: {
    code: 'FresqueEcoCirculaire',
    logo: '/assets/images/logo/logo_fresqueEcoCirculaire.webp',
    name: i18n.global.t('workshops.FresqueEcoCirculaire.name'),
    description: i18n.global.t('workshops.FresqueEcoCirculaire.description'),
    promoted: true,
    website: 'https://www.lafresquedeleconomiecirculaire.com/',
  },
  500: {
    code: 'FresqueFrontieresPlanetaires',
    logo: '/assets/images/logo/logo_FDFP.webp',
    name: i18n.global.t('workshops.FresqueFrontieresPlanetaires.name'),
    description: i18n.global.t(
      'workshops.FresqueFrontieresPlanetaires.description'
    ),
    promoted: true,
    website: 'https://www.1erdegre.earth/fresque-des-frontieres-planetaires',
  },
  501: {
    code: 'HorizonsDecarbones',
    logo: '/assets/images/logo/logo_HD.webp',
    name: i18n.global.t('workshops.HorizonsDecarbones.name'),
    description: i18n.global.t('workshops.HorizonsDecarbones.description'),
    promoted: true,
    website: 'https://www.1erdegre.earth/horizons-decarbones',
  },
  600: {
    code: '2030Glorieuses',
    logo: '/assets/images/logo/logo_2030Glorieuses.webp',
    name: i18n.global.t('workshops.2030Glorieuses.name'),
    description: i18n.global.t('workshops.2030Glorieuses.description'),
    promoted: true,
    website: 'https://www.2030glorieuses.org/',
  },
  700: {
    code: 'FresqueRenovation',
    logo: '/assets/images/logo/logo_Fresque-de-la-renovation-noir.webp',
    name: i18n.global.t('workshops.FresqueRenovation.name'),
    description: i18n.global.t('workshops.FresqueRenovation.description'),
    promoted: true,
    website: 'https://fresquedelarenovation.org/',
  },
  701: {
    code: 'FresqueEnergie',
    logo: '/assets/images/logo/logo_fresqueEnergie.png',
    name: i18n.global.t('workshops.FresqueEnergie.name'),
    description: i18n.global.t('workshops.FresqueEnergie.description'),
    promoted: true,
    website: 'https://fresquedelenergie.org/',
  },
  702: {
    code: 'FresqueDesPossibles',
    logo: '/assets/images/logo/logo_fresqueDesPossibles.webp',
    name: i18n.global.t('workshops.FresqueDesPossibles.name'),
    description: i18n.global.t('workshops.FresqueDesPossibles.description'),
    promoted: true,
    website: 'https://www.lelieudit.fr/la-fresque-des-possibles/',
  },
  703: {
    code: 'FresqueCommunication',
    logo: '/assets/images/logo/logo_fresqueCommunication.webp',
    name: i18n.global.t('workshops.FresqueCommunication.name'),
    description: i18n.global.t('workshops.FresqueCommunication.description'),
    promoted: true,
    website: 'https://lafresquedelacommunication.wordpress.com/',
  },
  704: {
    code: 'ZooFresque',
    logo: '/assets/images/logo/logo_zoofresque.webp',
    name: i18n.global.t('workshops.ZooFresque.name'),
    description: i18n.global.t('workshops.ZooFresque.description'),
    promoted: true,
    website: 'https://zoofresque.wordpress.com/',
  },
  705: {
    code: 'NotreTour',
    logo: '/assets/images/logo/logo_notre_tour.png',
    name: i18n.global.t('workshops.NotreTour.name'),
    description: i18n.global.t('workshops.NotreTour.description'),
    promoted: true,
    website: 'https://www.wearemush.com/notre-tour',
  },
  800: {
    code: 'PlanetC',
    logo: '/assets/images/logo/logo_PlanetC.jpg',
    name: i18n.global.t('workshops.PlanetC.name'),
    description: i18n.global.t('workshops.PlanetC.description'),
    promoted: false,
    website: 'https://planetc.org/',
  },
  801: {
    code: 'FresqueDuSol',
    logo: '/assets/images/logo/logo_FresqueDuSol.png',
    name: i18n.global.t('workshops.FresqueDuSol.name'),
    description: i18n.global.t('workshops.FresqueDuSol.description'),
    promoted: true,
    website: 'https://fresquedusol.com/',
  },
}

export type CodeDepartement = string

export type ISODateString = string

export type Workshop = {
  address: string
  city: string
  department: CodeDepartement
  description: string
  end_date: ISODateString
  full_location: string
  kids: boolean
  latitude: number
  longitude: number
  location_name: string
  online: boolean
  scrape_date: ISODateString
  sold_out: boolean
  source_link: string
  start_date: ISODateString
  tickets_link: string
  title: string
  training: boolean
  workshop_type: number
  zip_code: string
}

export type Coordinates = { latitude: number; longitude: number }
export type Location = Coordinates & { city: string; cp: string }

export type SearchType = 'standard' | 'atelier' | 'formation' | 'junior' | 'all'
export const TYPE_RECHERCHE_PAR_DEFAUT: SearchType = 'atelier'

export type WorkshopsParDepartement = {
  workshopsDisponibles: Workshop[]
  codeDepartements: CodeDepartement[]
  derniereMiseAJour: ISODateString
}

export type WorkshopsAffichableAvecDistance = Workshop & {
  distance: number | undefined
}
export type WorkshopsAvecDistanceParDepartement = {
  workshopsMatchantCriteres: WorkshopsAffichableAvecDistance[]
  workshopsDisponibles: WorkshopsAffichableAvecDistance[]
  codeDepartements: CodeDepartement[]
  derniereMiseAJour: ISODateString
}
