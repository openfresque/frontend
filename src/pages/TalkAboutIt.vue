<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ $t('talkAboutIt.title') }}</h2>

      <p class="mb-6">
        {{ $t('talkAboutIt.campaign') }}
      </p>

      <h3 class="text-h5 mb-3">{{ $t('talkAboutIt.whatFor') }}</h3>
      <p class="mb-4">
        {{ $t('talkAboutIt.throughoutMay') }}
      </p>

      <!-- Campaign logo -->
      <div class="d-flex justify-center mb-6">
        <v-img
          class="mt-2"
          src="/assets/images/campaign/lets-talk-about-it.png"
          alt="Let's Talk About It Campaign"
          max-width="300"
          contain
        />
      </div>

      <p class="mb-4">
        {{ $t('talkAboutIt.aimOfOperation') }}
      </p>
      <ul class="mb-6">
        <li class="mb-2">{{ $t('talkAboutIt.jointCommunication') }}</li>
        <li class="mb-2">{{ $t('talkAboutIt.commonMap') }}</li>
        <li class="mb-2">{{ $t('talkAboutIt.ticketingTools') }}</li>
      </ul>

      <h3 class="text-h5 mb-3">{{ $t('talkAboutIt.yourRole') }}</h3>
      <p class="mb-3">
        {{ $t('talkAboutIt.planWorkshops') }}
      </p>
      <p class="mb-6">
        {{ $t('talkAboutIt.createSessions') }}
      </p>

      <div class="d-flex flex-wrap gap-6 my-8 justify-center">
        <v-btn
          class="card-action-button"
          color="primary"
          href="https://docs.google.com/document/d/1ehh2JCkDod6mlIDUpnS70P6uNK4FCJ2Q4P7_kOWYcE0/edit?tab=t.60j2jenwg7pi"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitEnglish') }}
        </v-btn>
        <v-btn
          class="card-action-button"
          color="primary"
          href="https://ab6pg.r.sp1-brevo.net/mk/cl/f/sh/SMK1E8tHeGLdZlc9f7mw6xwizWQH/aGfBHlu4EXpj"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitFrench') }}
        </v-btn>
        <v-btn
          class="card-action-button"
          color="primary"
          href="https://ab6pg.r.sp1-brevo.net/mk/cl/f/sh/SMK1E8tHeGZMU3G41S5uIcYCw7an/MSP3UQY_sLPg"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitSpanish') }}
        </v-btn>
      </div>

      <h2 class="text-h4 mb-4">{{ $t('talkAboutIt.theMap') }}</h2>

      <!-- Map placeholder -->
      <div class="map-container mb-6">
        <div
          class="map-height"
          id="talkAboutItMap"
        ></div>
      </div>

      <!-- Workshop List -->
      <SearchResultsList
        v-if="workshopsForList.length > 0"
        :workshops="workshopsForList"
        :online="undefined"
        :location-title="
          $t('talkAboutIt.campaignTitle', 'Let\'s Talk About It Campaign')
        "
        :international="true"
      ></SearchResultsList>

      <p v-if="isLoading">{{ $t('common.loading') }}</p>
      <p v-if="!isLoading && workshopsForList.length === 0">
        {{
          $t(
            'talkAboutIt.noWorkshops',
            'No workshops found for this campaign yet.'
          )
        }}
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import type { LatLngTuple, Marker } from 'leaflet'
  import type { Workshop as BaseWorkshop } from '@/common/Conf'
  import { Icon, map, marker, tileLayer } from 'leaflet'
  // @ts-ignore
  import { MarkerClusterGroup } from 'leaflet.markercluster'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTheme } from 'vuetify'
  import SearchResultsList from '@/components/SearchResultsList.vue'
  import { getFlagEmoji } from '@/utils/flagEmoji'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  // Extend the Conf.Workshop type to carry optional language and country codes
  type WorkshopWithLang = BaseWorkshop & {
    language_code?: string
    country_code?: string
  }

  type RawWorkshopData = {
    title: string
    longitude: string | undefined
    latitude: string | undefined
    tickets_link: string | undefined
    location_name: string | undefined
    address: string | undefined
    city: string | undefined
    online: boolean
    language_code: string | undefined
    country_code: string | undefined
    start_date?: string
    end_date?: string
    full_location?: string
    workshop_type?: number | string
  }

  type WorkshopCarte = {
    nom: string
    longitude: number
    latitude: number
    reservation: string | undefined
    location_name: string | undefined
    address: string | undefined
    city: string | undefined
    language_code: string | undefined
    country_code: string | undefined
  }

  const mymap = ref<any>(null)
  const workshopsForList = ref<WorkshopWithLang[]>([])
  const isLoading = ref(true)
  const { t } = useI18n()
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)
  const mapLayer = ref<any>(null)

  onMounted(async () => {
    mymap.value = map('talkAboutItMap', {
      markerZoomAnimation: false,
    }).setView([46.505, 3], 2)

    try {
      const url1 = `https://raw.githubusercontent.com/trouver-une-fresque/trouver-une-fresque-data/main/campaigns/lets-talk-about-it/lets_talk_about_it_processed.json`
      const url2 = `https://raw.githubusercontent.com/trouver-une-fresque/trouver-une-fresque-data/main/campaigns/lets-talk-about-it/lets_talk_about_it_2_processed.json`

      // Fetch both data sources
      const [response1, response2] = await Promise.all([
        fetch(url1),
        fetch(url2),
      ])

      if (!response1.ok || !response2.ok) {
        throw new Error(
          `HTTP error! status: ${response1.status} or ${response2.status}`
        )
      }

      // Parse both JSON responses
      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json(),
      ])

      // Merge the data from both sources
      const rawWorkshopsData: RawWorkshopData[] = [...data1, ...data2].filter(
        workshop => workshop.workshop_type !== -1
      )

      // Map ALL raw workshops to Workshop[] type for the list
      workshopsForList.value = rawWorkshopsData.map(
        (raw): WorkshopWithLang => ({
          title: raw.title,
          language_code: raw.language_code || '',
          country_code: raw.country_code || '',
          longitude: Number.parseFloat(raw.longitude || '0'),
          latitude: Number.parseFloat(raw.latitude || '0'),
          tickets_link: raw.tickets_link || '',
          location_name: raw.location_name || '',
          address: raw.address || '',
          city: raw.city || '',
          online: raw.online,
          start_date: raw.start_date || '',
          end_date: raw.end_date || '',
          full_location: raw.full_location || '',
          department: '',
          description: '',
          kids: false,
          scrape_date: new Date().toISOString(),
          source_link: raw.tickets_link || '',
          zip_code: '',
          workshop_type:
            raw.workshop_type === undefined
              ? 0
              : Number.parseInt(String(raw.workshop_type), 10),
          sold_out: false,
          training: false,
        })
      )

      // Filter raw data specifically for the map (offline + valid coords)
      const workshopsFilteredForMap = rawWorkshopsData
        .filter((workshop: RawWorkshopData) => workshop.online === false)
        .filter((workshop: RawWorkshopData) => {
          const latStr = workshop.latitude ?? ''
          const lonStr = workshop.longitude ?? ''
          const lat = Number.parseFloat(latStr)
          const lon = Number.parseFloat(lonStr)
          return (
            !isNaN(lat) &&
            !isNaN(lon) &&
            lat >= -90 &&
            lat <= 90 &&
            lon >= -180 &&
            lon <= 180
          )
        })

      // Map the *filtered data* for the map pins (uses WorkshopCarte)
      const workshopsCarte = workshopsFilteredForMap.map<WorkshopCarte>(
        (workshop: RawWorkshopData) => ({
          nom: workshop.title,
          longitude: Number.parseFloat(workshop.longitude!),
          latitude: Number.parseFloat(workshop.latitude!),
          reservation: workshop.tickets_link,
          location_name: workshop.location_name || undefined,
          address: workshop.address || undefined,
          city: workshop.city || undefined,
          language_code: workshop.language_code,
          country_code: workshop.country_code,
        })
      )

      // Apply initial map layer based on theme
      setMapLayer()

      // Create and add markers to the map using the filtered/mapped map data
      if (workshopsCarte.length > 0) {
        const markers = creerPins(workshopsCarte)
        mymap.value.addLayer(markers)
      } else {
        console.warn('No valid workshops found to display on the map.')
      }
    } catch (error) {
      console.error('Error loading or processing workshop data:', error)
      workshopsForList.value = []
    } finally {
      isLoading.value = false
    }
  })

  // Set the map layer based on current theme
  function setMapLayer() {
    if (mapLayer.value) {
      mymap.value.removeLayer(mapLayer.value)
    }

    mapLayer.value = isDark.value
      ? tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          }
        )
      : tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })

    mapLayer.value.addTo(mymap.value)
  }

  // Watch for theme changes and update map layer
  watch(isDark, () => {
    if (mymap.value) {
      setMapLayer()
    }
  })

  onUnmounted(() => {
    if (mymap.value) {
      mymap.value.remove()
    }
  })

  function creerPins(lieux: WorkshopCarte[]) {
    const markers = lieux.reduce((markers, lieu) => {
      let reservation_str = ''
      if (lieu.reservation === undefined) {
        reservation_str = '-' // Default value if reservation is undefined
      } else {
        if (lieu.reservation.indexOf('http') === 0) {
          reservation_str = `<a href="${lieu.reservation}" target="_blank" rel="noopener noreferrer">${lieu.reservation.slice(0, 35) + '...'}</a>`
        }
      }

      // Flag Emoji Logic
      const country_flag_emoji = getFlagEmoji(lieu.country_code, 'country')
      const language_flag_emoji = getFlagEmoji(lieu.language_code, 'language')
      const language_display = lieu.language_code?.toUpperCase() || '-'

      // Popup content
      const string_popup = `
      <span style='font-size: 150%;'>${lieu.nom} ${country_flag_emoji}</span>
      <br>
      <b>${t('map.address')} :</b> ${lieu.location_name ? `${lieu.location_name}, ` : ''}${lieu.address}, ${lieu.city}
      <br>
      <b>${t('map.language', 'Language')} :</b> ${language_display} ${language_flag_emoji}
      <br>
      <b>${t('map.booking')} :</b> ${reservation_str || '-'}
    `

      const newMarker = marker([lieu.latitude, lieu.longitude] as LatLngTuple, {
        icon: new Icon.Default({
          imagePath: `/assets/images/png/`,
          iconUrl: `marker-icon-2x.png`,
          iconSize: [32, 31],
          iconAnchor: [8, 31],
        }),
      }).bindPopup(string_popup)
      newMarker.on('click', function () {
        // @ts-ignore
        this.openPopup()
      })

      markers.push(newMarker)
      return markers
    }, [] as Marker[])

    const markersGroup = new MarkerClusterGroup({
      disableClusteringAtZoom: 9,
      chunkedLoading: true,
    })
    markersGroup.addLayers(markers, true)
    return markersGroup
  }
</script>

<style scoped>
  .map-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .map-height {
    height: 500px;
    width: 100%;
  }
</style>

<style scoped lang="scss">
  .card-action-button {
    flex: 1 1 auto;
    min-width: 0;
    height: auto;
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 1.2;
    min-height: 44px;
  }

  .card-action-button :deep(.v-btn__content) {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
</style>
