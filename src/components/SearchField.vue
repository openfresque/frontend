<template>
  <div>
    <router-view />
    <v-autocomplete
      class="search-field"
      ref="autocompleteRef"
      :label="t('searchField')"
      max-width="500px"
      variant="solo"
      no-data-text="Aucun résultat"
      :items="autocompleteMatches"
      :return-object="true"
      :custom-filter="() => true"
      :model-value="modelValue"
      @update:search="search"
      @update:model-value="goToSearchResults"
      @update:focused="setFocused"
      clear-on-select
      auto-select-first
      hide-details
      density="comfortable"
    >
      <template #item="{ item, props }">
        <v-list-item
          v-bind="props"
          :title="undefined"
          density="comfortable"
        >
          <strong
            >{{ item.props.codePostal
            }}{{ item.props.code_departement }}&nbsp;-&nbsp;</strong
          >{{ item.title }}
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div v-if="!searchValue && !focused">
          <strong
            >{{ item.props.codePostal
            }}{{ item.props.code_departement }}&nbsp;-&nbsp;</strong
          >{{ item.title.toUpperCase()[0] + item.title.slice(1).toLowerCase() }}
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts" setup>
  import type { AutocompleteItem, Commune, Departement } from '@/state/State'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import router from '@/router'
  import {
    rechercheCommuneDescriptor,
    rechercheDepartementDescriptor,
  } from '@/routing/DynamicURLs'
  import { State } from '@/state/State'

  const { t } = useI18n()

  const props = defineProps({
    modelValue: {
      type: Object as () => AutocompleteItem | null,
      required: false,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
  })

  const autocompleteMatches = ref<AutocompleteItem[]>([])
  const searchValue = ref<string | null>(null)
  const focused = ref(false)
  const autocompleteRef = ref<any>(null)

  function setFocused(isFocused: boolean) {
    focused.value = isFocused
  }

  async function search(searchTerm: string | null) {
    searchValue.value = searchTerm
    if (searchTerm === null) {
      autocompleteMatches.value = []
      return
    }
    const suggestions = await State.current.autocomplete.suggest(searchTerm)
    let uid = 0
    autocompleteMatches.value = suggestions.map((suggestion: any) => ({
      value: uid++,
      title: suggestion.nom ?? suggestion.nom_departement,
      props: suggestion,
    }))
  }

  async function goToSearchResults(selected: AutocompleteItem | null) {
    const autocomplete = document.querySelector('.v-autocomplete input')
    if (autocomplete) {
      ;(autocomplete as any).blur()
    }

    if (!selected) return

    if ('codePostal' in selected.props) {
      // search by commune
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
      })
      console.log('Navigating to', url)
      router.push(url)
    } else {
      // search by departement
      const dpt = selected.props as Departement
      const url = rechercheDepartementDescriptor.urlGenerator({
        codeDepartement: dpt.code_departement,
        nomDepartement: dpt.nom_departement,
        searchType: 'atelier',
      })
      console.log('Navigating to', url)
      router.push(url)
    }
  }

  onMounted(() => {
    if (props.modelValue) {
      search(props.modelValue.title)
    } else {
      search('')
    }

    // Focus the input element on mount if autofocus prop is true
    if (props.autofocus) {
      autocompleteRef.value?.focus()
    }
  })
</script>

<style scoped>
  .search-field {
    &:deep(.v-autocomplete__selection) {
      white-space: nowrap !important;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
