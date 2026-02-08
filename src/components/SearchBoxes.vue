<template>
  <div
    class="d-flex flex-column flex-sm-row"
    style="max-width: 600px; width: 100%"
  >
    <v-select
      class="w-100 mb-1 mb-sm-0 mr-sm-1"
      v-model="selectedFlag"
      :items="['France 🇫🇷', 'Switzerland 🇨🇭']"
      variant="solo"
      hide-details
      density="comfortable"
    ></v-select>
    <SearchField
      class="d-flex flex-grow-1 w-100"
      :autofocus="autofocus"
    ></SearchField>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import SearchField from '@/components/SearchField.vue'

  defineProps({
    autofocus: {
      type: Boolean,
      default: false,
    },
  })

  const selectedFlag = ref('France 🇫🇷')
  watch(selectedFlag, newVal => {
    if (newVal === 'Switzerland 🇨🇭') {
      window.open('https://oneplanetfriends.ch/', '_blank')
      selectedFlag.value = 'France 🇫🇷'
    }
  })
</script>
