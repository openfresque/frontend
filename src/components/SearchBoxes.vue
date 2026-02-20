<template>
  <div
    class="d-flex flex-column ga-3 pa-4"
    style="max-width: 600px; width: 100%"
  >
    <div class="d-flex flex-column flex-sm-row ga-2 w-100">
      <v-select
        class="w-100"
        v-model="selectedFlag"
        :items="['France 🇫🇷', 'Switzerland 🇨🇭']"
        variant="solo"
        hide-details
        density="comfortable"
      ></v-select>
      <SearchField
        class="d-flex flex-grow-1 w-100"
        :autofocus="autofocus"
        v-model="selectedLocation"
      ></SearchField>
    </div>
    <v-select
      class="w-100 language-select"
      v-model="selectedLanguages"
      :items="languageItems"
      item-title="title"
      item-value="value"
      :label="t('search.languageOptional')"
      variant="solo"
      hide-details
      density="comfortable"
      multiple
      chips
      closable-chips
    ></v-select>
    <v-btn
      class="search-btn"
      color="primary"
      size="x-large"
      block
      :disabled="!selectedLocation"
      @click="onSearch"
    >
      {{ t('search.searchButton') }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  import type { AutocompleteItem, Commune, Departement } from '@/state/State'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import router from '@/router'
  import SearchField from '@/components/SearchField.vue'
  import {
    rechercheCommuneDescriptor,
    rechercheDepartementDescriptor,
  } from '@/routing/DynamicURLs'
  import { State } from '@/state/State'

  defineProps({
    autofocus: {
      type: Boolean,
      default: false,
    },
  })

  const { t } = useI18n()

  const supportedLocales = import.meta.env.VITE_SUPPORTED_LOCALES.split(
    ','
  ) as string[]

  const languageItems = computed(() =>
    supportedLocales.map((loc: string) => ({
      title: t(`locale.${loc}`),
      value: loc,
    }))
  )

  const selectedLocation = ref<AutocompleteItem | null>(null)
  const selectedLanguages = ref<string[]>([])

  async function onSearch() {
    const selected = selectedLocation.value
    if (!selected) return

    if ('codePostal' in selected.props) {
      const com = selected.props as Commune
      const nomDepartement = await State.current
        .departementsDisponibles()
        .then(
          deps =>
            deps.find(dep => dep.code_departement === com.codeDepartement)
              ?.nom_departement
        )
      if (!nomDepartement) {
        console.error('Could not find departement for commune', com)
        return
      }
      const url = rechercheCommuneDescriptor.urlGenerator({
        codeDepartement: com.codeDepartement,
        nomDepartement,
        codeCommune: com.code,
        codePostal: com.codePostal,
        nomCommune: com.nom,
        tri: 'distance',
        searchType: 'atelier',
        languageCodes: selectedLanguages.value,
      })
      router.push(url)
    } else {
      const dpt = selected.props as Departement
      const url = rechercheDepartementDescriptor.urlGenerator({
        codeDepartement: dpt.code_departement,
        nomDepartement: dpt.nom_departement,
        searchType: 'atelier',
        languageCodes: selectedLanguages.value,
      })
      router.push(url)
    }
  }

  const selectedFlag = ref('France 🇫🇷')
  watch(selectedFlag, newVal => {
    if (newVal === 'Switzerland 🇨🇭') {
      window.open('https://oneplanetfriends.ch/', '_blank')
      selectedFlag.value = 'France 🇫🇷'
    }
  })
</script>

<style scoped>
  .search-btn {
    margin-top: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .language-select :deep(.v-chip) {
    margin: 6px 4px;
  }

  .language-select :deep(.v-select__selection) {
    margin: 4px 0;
  }
</style>
