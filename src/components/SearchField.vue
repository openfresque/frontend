<template>
  <div class="w-100">
    <router-view />
    <v-autocomplete
      class="search-field"
      ref="autocompleteRef"
      :label="t('searchField')"
      variant="solo"
      no-data-text="Aucun résultat"
      :items="autocompleteMatches"
      :return-object="true"
      :custom-filter="() => true"
      :model-value="modelValue"
      @update:model-value="onSelect"
      @update:search="onSearch"
      @update:focused="onFocused"
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
        <div v-if="!typing && !focused">
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
  import type { AutocompleteItem } from '@/state/State'
  import { nextTick, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
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

  const emit = defineEmits<{
    (e: 'update:modelValue', item: AutocompleteItem | null): void
  }>()

  const autocompleteMatches = ref<AutocompleteItem[]>([])
  const typing = ref(false)
  const focused = ref(false)
  const autocompleteRef = ref<any>(null)

  function onSelect(selected: AutocompleteItem | null) {
    typing.value = false
    emit('update:modelValue', selected)
    if (selected) {
      nextTick(() => {
        autocompleteRef.value?.blur()
      })
    }
  }

  function onFocused(isFocused: boolean) {
    focused.value = isFocused
  }

  async function onSearch(searchTerm: string | null) {
    typing.value = !!searchTerm
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

  onMounted(() => {
    if (props.modelValue) {
      onSearch(props.modelValue.title)
    } else {
      onSearch('')
    }

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
