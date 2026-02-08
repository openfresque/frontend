<template>
  <div>
    <div class="px-4">
      <v-row class="d-flex">
        <v-col
          class="d-flex"
          v-for="workshop in workshops"
          :key="workshop.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        >
          <v-card class="workshop-card ma-2 d-flex justify-center align-center">
            <div class="card-content">
              <a
                :href="workshop.website"
                target="_blank"
              >
                <div class="logo-container">
                  <v-img
                    class="workshop-logo"
                    :src="workshop.logo"
                    :alt="workshop.name"
                  />
                </div>
              </a>
              <v-card-title>{{
                t(`workshops.${workshop.code}.name`)
              }}</v-card-title>
              <v-card-text>{{
                t(`workshops.${workshop.code}.description`)
              }}</v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ATELIERS } from '@/common/Conf'

  const { t } = useI18n()
  const workshops = ref([])

  onMounted(() => {
    for (const atelier of Object.values(ATELIERS)) {
      if (atelier.promoted) workshops.value.push(atelier)
    }
  })
</script>

<style scoped>
  .workshop-card {
    transition: transform 0.3s ease;
    padding: 20px;
    flex: 1; /* Ensure the card takes up equal space */

    &:deep(.v-card-title) {
      white-space: normal;
    }
  }

  .workshop-card:hover {
    transform: scale(1.05);
  }

  .card-content {
    text-align: center;
  }

  .workshop-logo {
    max-width: 60%;
    max-height: 60px;
    height: auto;
    margin: 0 auto; /* Center the image horizontally */
    display: block; /* Ensure the image is displayed as a block element */
  }
</style>

<style>
  @import '@/styles/logo-container.scss';
</style>
