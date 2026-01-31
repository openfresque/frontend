<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ t('localGroups.title') }}</h2>

      <h2>{{ t('localGroups.globalCommunity.heading') }}</h2>

      <p>
        {{ t('localGroups.globalCommunity.paragraph') }}
      </p>

      <h2>{{ t('localGroups.builtByLocal.heading') }}</h2>

      <p>
        {{ t('localGroups.builtByLocal.paragraph1') }}
      </p>

      <p>
        {{ t('localGroups.builtByLocal.paragraph2') }}
      </p>

      <!-- Map placeholder -->
      <div class="map-container mb-6">
        <div id="talkAboutItMap" class="map-height"></div>
      </div>

      <p>
        Consult a directory compiling all local groups to date here:
      </p>

      <v-btn
        color="primary"
        block
        size="large"
        href="https://docs.climatefresk.org/share/jkxjznbpoe/p/local-structures-dAD79CNE98"
        target="_blank"
        class="card-action-button"
      >
        Full directory of local groups
      </v-btn>

      <!-- Missing Local Groups button -->

      <p>
        {{ t('localGroups.missing.paragraph') }}
      </p>

      <v-btn
        color="primary"
        block
        size="large"
        href="https://tally.so/r/mVb0Qj"
        target="_blank"
        class="card-action-button"
      >
        {{ t('localGroups.missing.button') }}
      </v-btn>

      <p>
        {{ t('localGroups.unique.paragraph') }}
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
  import { map, tileLayer, marker, Marker, Icon, LatLngTuple } from 'leaflet'
  import { useI18n } from 'vue-i18n'
  import { useTheme } from 'vuetify'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  // @ts-ignore
  import { MarkerClusterGroup } from 'leaflet.markercluster'

  type LocalGroup = {
    title: string
    latitude: string
    longitude: string
    link: string
    country_code: string
  }

  const mymap = ref<any>(null)
  const { t } = useI18n()
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)
  const mapLayer = ref<any>(null)

  onMounted(async () => {
    mymap.value = map('talkAboutItMap', {
      markerZoomAnimation: false,
      maxZoom: 19,
    }).setView([46.505, 3], 2)

    // Fetch the remote local_groups.json data
    const response = await fetch('https://raw.githubusercontent.com/trouver-une-fresque/trouver-une-fresque-data/main/local_groups.json')
    const localGroups: LocalGroup[] = await response.json()
    // Filter and normalize to numeric coordinates
    const validGroups = localGroups
      .filter(group => !!group.latitude && !!group.longitude)
      .filter(group => {
        const lat = parseFloat(group.latitude)
        const lng = parseFloat(group.longitude)
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
      })
      .map(group => ({
        title: group.title,
        latitude: parseFloat(group.latitude),
        longitude: parseFloat(group.longitude),
        link: group.link,
      }))
    // Create and add markers for local groups
    const markers = creerLocalGroupPins(validGroups)
    mymap.value.addLayer(markers)

    // Apply initial map layer based on theme
    setMapLayer()
  })

  // Set the map layer based on current theme
  function setMapLayer() {
    if (mapLayer.value) {
      mymap.value.removeLayer(mapLayer.value)
    }

    if (isDark.value) {
      mapLayer.value = tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      )
    } else {
      mapLayer.value = tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      )
    }

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

  function creerLocalGroupPins(lieux: { title: string; latitude: number; longitude: number; link: string }[]) {
    const markers = lieux.reduce((acc, lieu) => {
      const popupContent = `
        <span style='font-size: 150%;'>${lieu.title}</span>
        <br>
        <a href="${lieu.link}" target="_blank">${lieu.link}</a>
      `
      const newMarker = marker([lieu.latitude, lieu.longitude] as LatLngTuple, {
        icon: new Icon.Default({
          imagePath: `/assets/images/png/`,
          iconUrl: `marker-icon-2x.png`,
          iconSize: [32, 31],
          iconAnchor: [8, 31],
        }),
      }).bindPopup(popupContent)
      newMarker.on('click', function () {
        // @ts-ignore
        this.openPopup()
      })
      acc.push(newMarker)
      return acc
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


<route>
{
  name: 'local-groups',
  path: '/local-groups'
}
</route> 