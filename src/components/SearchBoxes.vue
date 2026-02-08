<template>
  <div
    class="d-flex flex-column"
    style="max-width: 600px; width: 100%"
  >
    <div class="d-flex flex-column flex-sm-row mb-1">
      <v-select
        class="w-100 mb-1 mb-sm-0 mr-sm-1"
        v-model="selectedFlag"
        :items="['France 🇫🇷', 'Switzerland 🇨🇭']"
        variant="solo"
        hide-details
        density="comfortable"
      ></v-select>
      <v-select
        class="w-100"
        v-model="selectedLanguage"
        :items="languageItems"
        item-title="title"
        item-value="value"
        :label="t('search.language')"
        variant="solo"
        hide-details
        density="comfortable"
      ></v-select>
    </div>
    <SearchField
      class="d-flex flex-grow-1 w-100"
      :autofocus="autofocus"
      :language="selectedLanguage"
    ></SearchField>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SearchField from '@/components/SearchField.vue'
  import { LANGUAGE_ALL } from '@/routing/DynamicURLs'

  defineProps({
    autofocus: {
      type: Boolean,
      default: false,
    },
  })

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

  const selectedLanguage = ref(locale.value)

  const selectedFlag = ref('France 🇫🇷')
  watch(selectedFlag, newVal => {
    if (newVal === 'Switzerland 🇨🇭') {
      window.open('https://oneplanetfriends.ch/', '_blank')
      selectedFlag.value = 'France 🇫🇷'
    }
  })
</script>
