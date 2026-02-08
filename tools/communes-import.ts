/// <reference path="./types.d.ts" />
import leven from 'leven'
import fetch from 'node-fetch'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  rechercheCommuneDescriptor,
  rechercheDepartementDescriptor,
} from '../src/routing/DynamicURLs'
import { Strings } from '../src/utils/Strings'

const INDEXED_CHARS = `abcdefghijklmnopqrstuvwxyz01234567890_`.split('')
// const INDEXED_CHARS = `abc'`.split(''); // For testing purposes

// FYI, 800 => file size is ~50Ko
const MAX_NUMBER_OF_COMMUNES_PER_FILE = 800
const MAX_AUTOCOMPLETE_TRIGGER_LENGTH = 7

function keyOf(commune: Commune): string {
  return `${commune.code}__${commune.nom}`
}

function search(communes: Commune[], query: string): Commune[] {
  return communes.filter(
    c =>
      c.codePostal.startsWith(query) || c.fullTextNormalizedNom.includes(query)
  )
}

function toCompactedCommune(commune: Commune) {
  return {
    c: commune.code,
    z: commune.codePostal,
    n: commune.nom,
    d: commune.codeDepartement,
    g:
      commune && commune.centre && commune.centre.coordinates
        ? commune.centre.coordinates.join(',')
        : undefined,
  }
}

function communeComparatorFor(query: string) {
  return (c1: Commune, c2: Commune) =>
    Math.min(
      leven(c1.fullTextNormalizedNom, query),
      leven(c1.codePostal, query)
    ) -
    Math.min(
      leven(c2.fullTextNormalizedNom, query),
      leven(c2.codePostal, query)
    )
}

type MatchingCommunesSearchResult = {
  query: string
  matchingCommunesByKey: Map<string, Commune>
}
function generateFilesForQuery(
  query: string,
  communes: Commune[],
  unreferencedCommuneKeys: Set<string>
): MatchingCommunesSearchResult[] {
  try {
    const matchingCommunes = search(communes, query)
    const matchingCommunesByKey = new Map<string, Commune>(
      matchingCommunes.map(c => [keyOf(c), c])
    )

    if (matchingCommunes.length === 0) {
      return []
    } else if (
      matchingCommunes.length < MAX_NUMBER_OF_COMMUNES_PER_FILE ||
      query.length === MAX_AUTOCOMPLETE_TRIGGER_LENGTH
    ) {
      for (const [
        matchingCommuneKey,
        commune,
      ] of matchingCommunesByKey.entries()) {
        unreferencedCommuneKeys.delete(matchingCommuneKey)
      }

      matchingCommunes.sort(communeComparatorFor(query))

      // Converting commune info in a most compacted way : keeping only useful fields, 1-char keys, latng compaction
      const compactedCommunes = matchingCommunes.map(toCompactedCommune)

      writeFileSync(
        `../public/autocomplete-cache/tuf_${query}.json`,
        JSON.stringify({ query, communes: compactedCommunes }),
        'utf8'
      )
      console.info(`Autocomplete cache for query [${query}] completed !`)

      return [{ query, matchingCommunesByKey }]
    } else {
      const subQueries = INDEXED_CHARS.reduce((subQueries, q) => {
        Array.prototype.push.apply(
          subQueries,
          generateFilesForQuery(
            query + q,
            matchingCommunes,
            unreferencedCommuneKeys
          )
        )
        return subQueries
      }, [] as MatchingCommunesSearchResult[])

      let filteredMatchingCommunesByKey = new Map(matchingCommunesByKey)
      for (const r of subQueries) {
        for (const [key, commune] of r.matchingCommunesByKey.entries()) {
          filteredMatchingCommunesByKey.delete(key)
        }
      }

      // Here, the idea is to add communes with name shorter than the autocomplete keys
      // For example, we have the communes named "Y" and "Sai" while minimum autocomplete for these
      // kind of communes are respectively longer than 1 and 3
      // That's why we're adding here specific keys for these communes
      // Note that we don't have a lot of communes in that case, only 10 commune names, representing 13 different
      // communes
      filteredMatchingCommunesByKey = new Map(
        [...filteredMatchingCommunesByKey].filter(
          ([_, commune]) =>
            commune.fullTextNormalizedNom.length === query.length
        )
      )
      if (filteredMatchingCommunesByKey.size > 0) {
        const communesMatchantExactement = [
          ...filteredMatchingCommunesByKey.values(),
        ]
        for (const k of filteredMatchingCommunesByKey.keys()) {
          unreferencedCommuneKeys.delete(k)
        }

        communesMatchantExactement.sort(communeComparatorFor(query))

        // Converting commune info in a most compacted way : keeping only useful fields, 1-char keys, latng compaction
        const compactedCommunesNonGereesParLesSousNoeuds =
          communesMatchantExactement.map(toCompactedCommune)
        writeFileSync(
          `../public/autocomplete-cache/tuf_${query}.json`,
          JSON.stringify({
            query,
            communes:
              compactedCommunesNonGereesParLesSousNoeuds /* , subsequentAutoCompletes: true */,
          }),
          'utf8'
        )
        console.info(
          `Intermediate autocomplete cache for query [${query}] completed with ${compactedCommunesNonGereesParLesSousNoeuds.length} communes !`
        )

        subQueries.splice(0, 0, {
          query,
          matchingCommunesByKey: filteredMatchingCommunesByKey,
        })
      }

      return subQueries
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

function sitemapDynamicEntry(path: string): string {
  return `
    <url><loc>https://trouverunefresque.org${path}</loc><changefreq>always</changefreq><priority>0.1</priority></url>
    `.trim()
}
function sitemapIndexDynamicEntry(codeDepartement: string): string {
  return `
    <sitemap><loc>https://trouverunefresque.org/sitemaps/sitemap-${codeDepartement}.xml</loc></sitemap>
    `.trim()
}

const COLLECTIVITES_OUTREMER = new Map<string, Partial<Commune>>([
  [
    '97501',
    {
      codeDepartement: 'om',
      centre: { type: 'Point', coordinates: [-56.3814, 47.0975] },
    },
  ],
  [
    '97502',
    {
      codeDepartement: 'om',
      centre: { type: 'Point', coordinates: [-56.1833, 46.7667] },
    },
  ],
  [
    '97701',
    {
      codeDepartement: 'om',
      centre: { type: 'Point', coordinates: [-62.8314, 17.9034] },
    },
  ],
  [
    '97801',
    {
      codeDepartement: 'om',
      centre: { type: 'Point', coordinates: [-63.0785, 18.0409] },
    },
  ],
])

function completerCommunesOutremer(commune: Commune): Commune {
  return COLLECTIVITES_OUTREMER.has(commune.code)
    ? { ...commune, ...COLLECTIVITES_OUTREMER.get(commune.code) }
    : commune
}

const PARIS_COORDS_OVERRIDES = new Map<string, [number, number]>(
  [
    {
      c: '75056',
      z: '75001',
      g: [2.336_157_203_926_649, 48.862_839_482_299_15],
    },
    {
      c: '75056',
      z: '75002',
      g: [2.343_275_544_394_986_6, 48.868_890_372_616_54],
    },
    {
      c: '75056',
      z: '75003',
      g: [2.360_756_833_550_029_7, 48.862_864_926_393_61],
    },
    {
      c: '75056',
      z: '75004',
      g: [2.357_594_022_703_559, 48.854_395_816_328_56],
    },
    {
      c: '75056',
      z: '75005',
      g: [2.351_415_238_575_416, 48.843_550_635_618_69],
    },
    {
      c: '75056',
      z: '75006',
      g: [2.334_203_785_384_528, 48.848_980_256_324_32],
    },
    {
      c: '75056',
      z: '75007',
      g: [2.312_728_441_484_42, 48.857_101_424_737_17],
    },
    {
      c: '75056',
      z: '75008',
      g: [2.313_306_059_741_169_7, 48.872_970_528_629_36],
    },
    {
      c: '75056',
      z: '75009',
      g: [2.338_641_668_745_07, 48.877_292_437_964_16],
    },
    {
      c: '75056',
      z: '75010',
      g: [2.360_651_913_467_299, 48.876_540_291_329_32],
    },
    {
      c: '75056',
      z: '75011',
      g: [2.378_928_291_242_735, 48.860_013_350_538_79],
    },
    {
      c: '75056',
      z: '75012',
      g: [2.395_032_220_296_042, 48.840_422_306_550_08],
    },
    {
      c: '75056',
      z: '75013',
      g: [2.362_090_770_227_832_4, 48.829_047_870_070_54],
    },
    {
      c: '75056',
      z: '75014',
      g: [2.327_993_119_650_175, 48.830_255_148_704_83],
    },
    {
      c: '75056',
      z: '75015',
      g: [2.292_973_652_244_18, 48.840_585_736_849_37],
    },
    {
      c: '75056',
      z: '75016',
      g: [2.266_717_150_629_358, 48.853_676_256_892_13],
    },
    {
      c: '75056',
      z: '75017',
      g: [2.307_126_468_447_542_3, 48.887_935_193_625_65],
    },
    {
      c: '75056',
      z: '75018',
      g: [2.349_642_564_782_915, 48.892_325_725_601_89],
    },
    {
      c: '75056',
      z: '75019',
      g: [2.386_822_921_639_848_4, 48.887_176_262_044_115],
    },
    {
      c: '75056',
      z: '75020',
      g: [2.403_203_391_395_567_5, 48.862_725_685_060_646],
    },
  ].map<[string, [number, number]]>(communeDef => [
    `${communeDef.c}__${communeDef.z}`,
    communeDef.g as [number, number],
  ])
)

function surchargerCoordonnees(commune: Commune): Commune {
  if (PARIS_COORDS_OVERRIDES.has(`${commune.code}__${commune.codePostal}`)) {
    const coords = PARIS_COORDS_OVERRIDES.get(
      `${commune.code}__${commune.codePostal}`
    )!
    return { ...commune, centre: { ...commune.centre, coordinates: coords } }
  } else {
    return commune
  }
}

Promise.all([
  fetch(
    `https://geo.api.gouv.fr/communes?boost=population&fields=code,nom,codeDepartement,centre,codesPostaux`
  ).then(resp => resp.json()),
  fetch(`https://vitemadose.gitlab.io/vitemadose/departements.json`).then(
    resp => resp.json()
  ),
]).then(([rawCommunes, departements]: [RawCommune[], Departement[]]) => {
  const communes: Commune[] = rawCommunes
    .flatMap(rawCommune =>
      rawCommune.codesPostaux.map(cp => ({
        ...rawCommune,
        codePostal: cp,
        // /!\ important note : in this file, these strings are compared to "queries",
        // which are exclusively composed of the INDEXED_CHARS characters.
        // Strings.toFullTextNormalized() converts accents to these chars to make
        // this comparison possible.
        // The same method/implementation is used in Autocomplete.ts to create search prefixes
        // which are used to fetch the appropriate pre-computed Commune list computed here.
        fullTextNormalizedNom: Strings.toFullTextNormalized(rawCommune.nom),
      }))
    )
    .map(commune => completerCommunesOutremer(commune))
    .map(commune => surchargerCoordonnees(commune))

  const cacheDir = '../public/autocomplete-cache'
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true })
  }

  const communeByKey = communes.reduce((map, commune) => {
    map.set(keyOf(commune), commune)
    return map
  }, new Map<string, Commune>())

  const unreferencedCommuneKeys = new Set(communeByKey.keys())
  const generatedIndexes = INDEXED_CHARS.reduce((queries, q) => {
    Array.prototype.push.apply(
      queries,
      generateFilesForQuery(q, communes, unreferencedCommuneKeys).map(
        r => r.query
      )
    )
    return queries
  }, [])

  writeFileSync(
    '../public/autocompletes.json',
    JSON.stringify(generatedIndexes),
    'utf8'
  )

  const sitemapDir = '../public/sitemaps'
  if (!existsSync(sitemapDir)) {
    mkdirSync(sitemapDir, { recursive: true })
  }

  for (const department of departements) {
    // language=xml
    const content = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    ${rechercheDepartementDescriptor
      .urlGenerator({
        codeDepartement: department.code_departement,
        nomDepartement: department.nom_departement,
      })
      .map(url => sitemapDynamicEntry(url))
      .join('\n    ')}
    ${communes
      .filter(c => c.codeDepartement === department.code_departement)
      .map(c => {
        return `
    ${rechercheCommuneDescriptor
      .urlGenerator({
        codeDepartement: c.codeDepartement,
        nomDepartement: department.nom_departement,
        codeCommune: c.code,
        codePostal: c.codePostal,
        nomCommune: c.nom,
        tri: 'distance',
      })
      .map(url => sitemapDynamicEntry(url))
      .join('\n    ')}`
      })}
</urlset>`.trim()

    writeFileSync(
      `../public/sitemaps/sitemap-${department.code_departement}.xml`,
      content,
      'utf8'
    )
  }

  const siteMapIndexDynamicContent = ([] as string[])
    .concat(
      departements.map((department: Departement) => {
        return sitemapIndexDynamicEntry(department.code_departement)
      })
    )
    .join('\n  ')
  const sitemapTemplate = readFileSync('./sitemap_template.xml', 'utf8')
  const sitemapContent = sitemapTemplate.replace(
    '<!-- DYNAMIC CONTENT -->',
    siteMapIndexDynamicContent
  )
  writeFileSync('../public/sitemap.xml', sitemapContent, 'utf8')
})
