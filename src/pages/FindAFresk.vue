<template>
  <v-container max-width="1200px">
    <!-- search card section -->
    <section class="px-4">
      <v-card
        class="search-card pa-4 pa-sm-12 mt-16 mb-16"
        elevation="4"
        rounded="xl"
      >
        <v-card-title
          class="d-flex justify-center pt-4"
          max-width="700px"
        >
          <h2
            style="text-wrap-mode: wrap; max-width: 700px; text-align: center"
          >
            {{ t('welcome') }}
          </h2>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-center pt-6 pb-4">
          <SearchBoxes :autofocus="true" />
        </v-card-text>
      </v-card>
    </section>

    <!-- logo section -->
    <LogoWall />

    <!-- Q&A section -->
    <QnA />
  </v-container>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'
  import LogoWall from '@/components/LogoWall.vue'
  import QnA from '@/components/QnA.vue'
  import SearchBoxes from '@/components/SearchBoxes.vue'

  const { t } = useI18n()
</script>

<style lang="scss" scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-primary), 0.6),
      rgba(var(--v-theme-secondary), 0.6) 33%,
      rgba(var(--v-theme-info), 0.6) 66%,
      rgba(var(--v-theme-success), 0.6)
    );
  }
</style>
