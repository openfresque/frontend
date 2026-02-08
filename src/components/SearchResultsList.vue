<template>
  <v-container
    class="bg-background-2 mt-2"
    max-width="1200px"
  >
    <!-- Result summary -->
    <v-card variant="flat">
      <v-card-title
        class="text-center pb-0"
        style="white-space: wrap"
      >
        <v-icon
          v-if="filteredWorkshops.length > 0"
          color="green-darken-2"
          icon="mdi-calendar-check"
          size="large"
        ></v-icon>
        <v-icon
          v-else
          icon="mdi-calendar-remove"
          size="large"
        ></v-icon>
        {{ filteredWorkshops.length }} {{ getWorkshopType() }}
        <span v-if="searchByDpt">
          {{ t('results.for') + ' ' }}
        </span>
        <span v-else>
          {{ t('results.around') + ' ' }}
        </span>
        <strong>{{ locationTitle }}</strong></v-card-title
      >
      <v-card-subtitle
        class="text-center"
        style="white-space: wrap"
      >
        {{ t('results.lastUpdate') }} {{ getLastUpdateRelativeDate() }}
      </v-card-subtitle>
    </v-card>

    <!-- workshops list -->
    <v-infinite-scroll
      v-if="filteredWorkshopsToDisplay.length > 0"
      :items="filteredWorkshopsToDisplay"
      @load="loadMore"
      :empty-text="t('results.missingWorkshop')"
    >
      <template
        v-for="item in filteredWorkshopsToDisplay"
        :key="item"
      >
        <SearchResultsCard
          :workshop="item"
          :workshop-type-title="getWorkshopType(false)"
          :international="international"
          :language-code="item.language_code"
          :country-code="item.country_code"
        ></SearchResultsCard>
      </template>
    </v-infinite-scroll>

    <!-- no result card -->
    <v-card
      class="text-center my-6 no-result-card"
      v-else-if="!online"
    >
      <v-card-title
        class="text-center"
        style="white-space: wrap"
      >
        {{ t('results.doYouWantOnline') }}
      </v-card-title>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          color="primary"
          @click="$emit('showOnline')"
          variant="elevated"
          ripple
        >
          {{ t('results.includeOnline') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import type { Workshop, CodeDepartement, SearchType } from '@/common/Conf'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { LANGUAGE_ALL } from '@/routing/DynamicURLs'
  import distanceBetween from '@/utils/distance'

  const { t } = useI18n()

  const props = defineProps({
    workshops: {
      type: Array as PropType<Workshop[]>,
      required: true,
    },
    longitude: Number,
    latitude: Number,
    searchRadius: {
      type: Number,
      required: false,
      default: -1,
    },
    workshopType: {
      type: String as PropType<SearchType>,
      required: false,
      default: 'all' as SearchType,
    },
    online: {
      type: Boolean,
      required: false,
      default: false,
    },
    language: {
      type: String,
      required: false,
      default: LANGUAGE_ALL,
    },
    locationTitle: {
      type: String,
      required: false,
      default: '',
    },
    lastUpdateDate: {
      type: String,
      required: false,
      default: '',
    },
    searchByDpt: {
      type: Boolean,
      required: false,
      default: false,
    },
    dptNb: {
      type: String as PropType<CodeDepartement | ''>,
      required: false,
      default: '',
    },
    international: {
      type: Boolean,
      required: false,
      default: false,
    },
  })

  const filteredWorkshops = ref<Workshop[]>([])
  const filteredWorkshopsToDisplay = ref<Workshop[]>([])
  let infiniteScrollEvents:
    | ((value: 'ok' | 'empty' | 'error') => void)
    | undefined

  function getLastUpdateRelativeDate() {
    const lastUpdate = new Date(props.lastUpdateDate)
    const now = new Date()
    const diff = now.getTime() - lastUpdate.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      return t('results.today')
    }
    if (diffDays === 1) {
      return t('results.yesterday')
    }
    return `il y a ${diffDays} jours`
  }

  function getWorkshopType(usePlural = true) {
    const plural = usePlural && filteredWorkshops.value.length > 0 ? 's' : ''
    if (props.workshopType === 'junior') {
      // TODO @tbouvier: should use i18n plural
      return t('results.workshop') + plural + ' ' + t('results.junior') + plural
    } else if (props.workshopType === 'formation') {
      return t('results.training') + plural
    } else return t('results.workshop') + plural
  }

  function displayXMoreWorkshops(nb = 10) {
    const currentLength = filteredWorkshopsToDisplay.value.length
    let end = filteredWorkshopsToDisplay.value.length + nb

    if (end > filteredWorkshops.value.length) {
      end = filteredWorkshops.value.length
    }

    filteredWorkshopsToDisplay.value = filteredWorkshops.value.slice(0, end)
    const added = end - currentLength
    return added
  }

  function filterWorkshops() {
    filteredWorkshops.value = props.workshops.filter((workshop: Workshop) => {
      // language filter: keep if no language_code on the record, or if it matches
      if (
        props.language !== LANGUAGE_ALL &&
        workshop.language_code &&
        workshop.language_code !== props.language
      ) {
        return false
      }

      // junior filter
      if (
        props.workshopType === 'junior' &&
        (!workshop.kids || workshop.training) // don't show training for kids
      ) {
        return false
      }

      // training filter
      if (props.workshopType === 'formation' && !workshop.training) {
        return false
      }

      // workshop filter
      if (
        props.workshopType === 'atelier' &&
        (workshop.training || workshop.kids)
      ) {
        return false
      }

      // online toggle: exclude online-only events when not including online (and not in international mode)
      if (!props.international && !props.online && workshop.online) {
        return false
      }
      // include online workshops when the online toggle is on (bypass distance filter)
      if (!props.international && props.online && workshop.online) {
        return true
      }

      //   search by department filter
      if (props.searchByDpt) {
        return workshop.department === props.dptNb
      }

      // Distance filter
      if (props.searchRadius === -1) {
        return true
      }

      if (!props.longitude || !props.latitude) {
        console.warn('No longitude or latitude provided for workshop', workshop)
        return false
      }

      const distance = distanceBetween(
        { latitude: workshop.latitude, longitude: workshop.longitude },
        { latitude: props.latitude, longitude: props.longitude }
      )
      return distance <= props.searchRadius
    })

    sortWorkshops()
  }

  function sortWorkshops() {
    filteredWorkshops.value.sort((a, b) => {
      if (a.start_date < b.start_date) return -1
      if (a.start_date > b.start_date) return 1
      return 0
    })
  }

  function loadMore({
    done,
  }: {
    done: (status: 'ok' | 'empty' | 'error') => void
  }) {
    infiniteScrollEvents = done
    const added = displayXMoreWorkshops()
    console.log('added', added)
    if (added === 0) done('empty')
    else done('ok')
  }

  watch(
    () => [
      props.workshops,
      props.searchRadius,
      props.longitude,
      props.latitude,
      props.workshopType,
      props.online,
      props.language,
    ],
    newVal => {
      filteredWorkshops.value = []
      filteredWorkshopsToDisplay.value = []
      filterWorkshops()
      displayXMoreWorkshops()
      infiniteScrollEvents?.('ok')
    }
  )

  onMounted(() => {
    filterWorkshops()
    displayXMoreWorkshops()
  })
</script>

<style scoped>
  .no-result-card {
    @media screen and (max-width: 600px) {
      &:deep(.v-card-title) {
        font-size: 1rem;
      }

      &:deep(.v-btn__content) {
        font-size: 0.7rem;
      }
    }
  }
</style>
