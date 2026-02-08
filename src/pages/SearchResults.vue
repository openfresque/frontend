<template>
  <div>
    <v-container max-width="1200px">
      <!-- search card -->
      <v-container max-width="500px">
        <!-- search field -->
        <SearchField
          class="d-flex flex-grow-1 justify-center"
          v-model="searchItem"
        ></SearchField>

        <!-- online toggle -->
        <v-switch
          class="online-switch"
          v-model="online"
          color="primary"
          :label="t('search.includeOnline')"
          hide-details
        ></v-switch>

        <!-- language filter -->
        <v-select
          class="mt-2"
          v-model="language"
          :items="languageItems"
          item-title="title"
          item-value="value"
          :label="t('search.language')"
          variant="outlined"
          hide-details
          density="comfortable"
        ></v-select>

        <!-- search radius -->
        <div v-if="isSearchByCity()">
          <!-- desktop slider -->
          <div class="d-none d-sm-block text-caption mt-2">
            {{ t('search.area') }}
          </div>
          <v-slider
            class="d-none d-sm-block"
            v-model="distance"
            :max="5"
            show-ticks="always"
            :step="1"
            :ticks="tickLabels"
            tick-size="4"
            color="primary"
          ></v-slider>
          <!-- mobile slider -->
          <div class="d-sm-none text-caption mt-2">
            Rayon de recherche :
            {{
              tickDistances[distance] > 0
                ? '' + tickDistances[distance] + 'km'
                : t('search.all')
            }}
          </div>
          <v-slider
            class="d-sm-none"
            v-model="distance"
            :max="5"
            show-ticks="always"
            :step="1"
            :ticks="mobileTickLabels"
            tick-size="4"
            color="primary"
          ></v-slider>
        </div>
      </v-container>

      <v-tabs
        class="workshop-type-btn-div d-flex justify-center"
        v-model="tab"
        color="primary"
        grow
        fixed-tabs
      >
        <v-tab
          class="workshop-type-btn"
          value="atelier"
          variant="tonal"
          >{{ t('search.attendWorkshop') }}</v-tab
        >
        <v-tab
          class="workshop-type-btn"
          value="formation"
          variant="tonal"
          >{{ t('search.attendTrainingWorkshop') }}</v-tab
        >
        <v-tab
          class="workshop-type-btn"
          value="junior"
          variant="tonal"
          >{{ t('search.attendJuniorWorkshop') }}</v-tab
        >
      </v-tabs>
      <!-- results -->
      <div
        class="d-flex justify-center ma-4"
        v-if="isLoading"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <v-tabs-window
        v-else
        v-model="tab"
      >
        <v-tabs-window-item value="atelier">
          <SearchResultsList
            :workshops="filteredWorkshops"
            :longitude="selectedCity?.longitude"
            :latitude="selectedCity?.latitude"
            :search-radius="tickDistances[distance]"
            :workshop-type="'atelier'"
            :online="online"
            :language="language"
            :location-title="getLocationTitle()"
            :last-update-date="lastUpdateDate"
            :search-by-dpt="isSearchByDpt()"
            :dpt-nb="getDptCode()"
            @show-online="online = true"
          ></SearchResultsList>
        </v-tabs-window-item>

        <v-tabs-window-item value="formation">
          <SearchResultsList
            :workshops="filteredWorkshops"
            :longitude="selectedCity?.longitude"
            :latitude="selectedCity?.latitude"
            :search-radius="tickDistances[distance]"
            :workshop-type="'formation'"
            :online="online"
            :language="language"
            :location-title="getLocationTitle()"
            :last-update-date="lastUpdateDate"
            :search-by-dpt="isSearchByDpt()"
            :dpt-nb="getDptCode()"
            @show-online="online = true"
          ></SearchResultsList>
          <div class="results ma-2"></div>
        </v-tabs-window-item>

        <v-tabs-window-item value="junior">
          <SearchResultsList
            :workshops="filteredWorkshops"
            :longitude="selectedCity?.longitude"
            :latitude="selectedCity?.latitude"
            :search-radius="tickDistances[distance]"
            :workshop-type="'junior'"
            :online="online"
            :language="language"
            :location-title="getLocationTitle()"
            :last-update-date="lastUpdateDate"
            :search-by-dpt="isSearchByDpt()"
            :dpt-nb="getDptCode()"
            @show-online="online = true"
          ></SearchResultsList>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import type { Workshop, SearchType } from '@/common/Conf'
  import type { AutocompleteItem, Commune, Departement } from '@/state/State'
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import router, { ROUTE_SEARCH_CITY, ROUTE_SEARCH_DPT } from '@/router'
  import {
    LANGUAGE_ALL,
    rechercheCommuneDescriptor,
    rechercheDepartementDescriptor,
  } from '@/routing/DynamicURLs'
  import { State } from '@/state/State'

  const { t, locale } = useI18n()

  const supportedLocales = import.meta.env.VITE_SUPPORTED_LOCALES.split(
    ','
  ) as string[]

  const languageItems = computed(() => [
    { title: t('search.allLanguages'), value: LANGUAGE_ALL },
    ...supportedLocales.map((loc: string) => ({
      title: t(`locale.${loc}`),
      value: loc,
    })),
  ])

  const searchItem = ref<AutocompleteItem>({
    value: 0,
    title: '',
    props: {
      code_departement: '',
      code_region: 0,
      nom_departement: '',
      nom_region: '',
    },
  })

  const tickLabels = {
    0: '10 km',
    1: '25 km',
    2: '50 km',
    3: '100 km',
    4: '250 km',
    5: t('search.all'),
  }

  const mobileTickLabels = {
    0: '10 km',
    1: '',
    2: '',
    3: '',
    4: '',
    5: t('search.all'),
  }

  const tickDistances = [10, 25, 50, 100, 250, -1]

  const filteredWorkshops = ref<Workshop[]>([])
  const lastUpdateDate = ref('')
  const selectedCity = ref<Commune | undefined>(undefined)
  const selectedDpt = ref<Departement | undefined>(undefined)
  const distance = ref(2)
  const online = ref(false)
  const language = ref(LANGUAGE_ALL)
  const tab = ref('atelier')
  const isLoading = ref(false)
  let skipRouteUpdate = false

  watch([online, tab, language], () => {
    if (skipRouteUpdate) return
    updateRoute()
  })

  function updateRoute() {
    const params = router.currentRoute.value.params as any
    let url: string
    if (isSearchByCity()) {
      url = rechercheCommuneDescriptor.urlGenerator({
        codeDepartement: params.codeDpt,
        nomDepartement: params.nomDpt,
        codeCommune: params.codeCommune,
        codePostal: params.codePostal,
        nomCommune: params.nomCommune,
        tri: params.codeTriCentre,
        searchType: tab.value as SearchType,
        languageCode: language.value,
      })
    } else {
      url = rechercheDepartementDescriptor.urlGenerator({
        codeDepartement: params.codeDpt,
        nomDepartement: params.nomDpt,
        searchType: tab.value as SearchType,
        languageCode: language.value,
      })
    }
    // Include online param
    url = url.replace('/online-non', `/online-${online.value ? 'oui' : 'non'}`)
    history.replaceState({}, '', url)
  }

  function isSearchByCity() {
    const name = router.currentRoute.value.name as string
    return name === ROUTE_SEARCH_CITY || name === ROUTE_SEARCH_CITY + 'WithLang'
  }

  function isSearchByDpt() {
    const name = router.currentRoute.value.name as string
    return name === ROUTE_SEARCH_DPT || name === ROUTE_SEARCH_DPT + 'WithLang'
  }

  function getDptCode() {
    const params = router.currentRoute.value.params as any
    return params.codeDpt
  }

  async function refresh() {
    isLoading.value = true
    skipRouteUpdate = true
    const params = router.currentRoute.value.params as any
    // City search
    if (isSearchByCity()) {
      searchItem.value = {
        value: -1,
        title: params.nomCommune.replace(/_/g, ' '),
        props: {
          code: params.codeCommune,
          codeDepartement: params.codeDpt,
          codePostal: params.codePostal,
          latitude: 0,
          longitude: 0,
          nom: params.nomCommune,
        },
      }
      selectedCity.value = await State.current.autocomplete.findCommune(
        params.codePostal,
        params.codeCommune
      )
      // Department search
    } else if (isSearchByDpt()) {
      searchItem.value = {
        value: -1,
        title: params.nomDpt.replace(/_/g, ' '),
        props: {
          code_departement: params.codeDpt,
          code_region: 0,
          nom_departement: params.nomDpt,
          nom_region: '',
        },
      }
      selectedDpt.value = await State.current.autocomplete.findDepartement(
        params.codeDpt
      )
    }

    online.value = params.includesOnline === 'oui'
    tab.value = params.typeRecherche
    language.value = params.languageCode || locale.value
    // Allow watch to trigger updateRoute() again after syncing from route params
    await nextTick()
    skipRouteUpdate = false
    const allWorkshops = await State.current.allWorkshops()
    filteredWorkshops.value = allWorkshops.workshopsDisponibles
    lastUpdateDate.value = allWorkshops.derniereMiseAJour
    isLoading.value = false
  }

  function getLocationTitle() {
    let ret = ''
    if (isSearchByCity()) {
      ret += selectedCity.value?.nom
      ret += ' (' + selectedCity.value?.codePostal + ')'
      if (online.value) {
        ret += ' ' + t('results.orOnline')
      }
    }
    if (isSearchByDpt()) {
      ret += selectedDpt.value?.nom_departement
      ret += ' (' + selectedDpt.value?.code_departement + ')'
      if (online.value) {
        ret += ' ' + t('results.orOnline')
      }
    }
    return ret
  }

  onMounted(() => {
    refresh()
  })

  router.afterEach(() => {
    refresh()
  })
</script>

<route>
{
  name: 'searchCom',
  //path: '/:locale?/recherche/commune/:codeCommune/:codePostal/:nomCommune/:typeRecherche/:codeTriCentre/:includesOnline',
  path: '/recherche/commune/:codeCommune/:codePostal/:nomCommune/:typeRecherche/:codeTriCentre/:includesOnline',
  props: true
}
</route>

<route>
{
  name: 'searchDpt',
  //path: '/:locale?/recherche/departement/:codeDpt/:nomDpt/:typeRecherche/:codeTriCentre/:includesOnline',
  path: '/recherche/departement/:codeDpt/:nomDpt/:typeRecherche/:codeTriCentre/:includesOnline',
  props: true
}
</route>

<style scoped>
  .results {
    background-color: rgb(var(--v-theme-background-2));
  }

  .workshop-type-btn {
    @media screen and (max-width: 600px) {
      width: 120px !important;
    }
    & :deep(.v-btn__content) {
      white-space: wrap !important;
      font-size: 0.7rem !important;
    }
  }

  .online-switch {
    @media screen and (max-width: 400px) {
      & :deep(.v-label) {
        font-size: 0.7rem !important;
        font-weight: 400 !important;
      }
    }
  }
</style>
