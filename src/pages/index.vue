<template>
  <v-container max-width="1200px">
    <!-- search card section -->
    <section class="px-4">
      <v-card class="search-card pa-2 pa-sm-10 mt-12 mb-12">
        <v-card-title
          class="d-flex justify-center"
          max-width="600px"
        >
          <h2
            style="text-wrap-mode: wrap; max-width: 600px; text-align: center"
          >
            {{ t('welcome') }}
          </h2>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <SearchBoxes />
        </v-card-text>
      </v-card>
    </section>

    <!-- Hero section -->
    <section class="mb-12 px-4">
      <p>{{ t('homepage.hero.subtitle') }}</p>
      <h1 class="text-h6 mb-6">{{ t('homepage.hero.title') }}</h1>
    </section>

    <!-- Climate Fresk movement, Collaboration, and Mapping groups sections in 3 columns -->
    <v-row class="mt-12 mb-12 px-4">
      <!-- Climate Fresk movement -->
      <v-col
        class="d-flex"
        cols="12"
        md="4"
      >
        <v-card
          class="d-flex flex-column flex-grow-1"
          elevation="2"
          rounded="lg"
        >
          <div class="card-title pa-3">
            {{ t('homepage.movement.title') }}
          </div>
          <v-divider></v-divider>
          <v-card-text class="text-body-1 flex-grow-1 pa-4">
            <p class="mb-4 card-description">
              {{ t('homepage.hero.description') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-4 mt-auto">
            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              :to="'/find-a-fresk'"
            >
              {{ t('homepage.movement.button') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Mapping groups section -->
      <v-col
        class="d-flex"
        cols="12"
        md="4"
      >
        <v-card
          class="d-flex flex-column flex-grow-1"
          elevation="2"
          rounded="lg"
        >
          <div class="card-title pa-3">
            {{ t('homepage.mapping.title') }}
          </div>
          <v-divider></v-divider>
          <v-card-text class="text-body-1 flex-grow-1 pa-4">
            <p class="mb-4 card-description">
              {{ t('homepage.mapping.description') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-4 mt-auto">
            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              :to="'/local-groups'"
            >
              {{ t('homepage.mapping.button') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Collaboration section -->
      <v-col
        class="d-flex"
        cols="12"
        md="4"
      >
        <v-card
          class="d-flex flex-column flex-grow-1"
          elevation="2"
          rounded="lg"
        >
          <div class="card-title pa-3">
            {{ t('homepage.collaboration.title') }}
          </div>
          <v-divider></v-divider>
          <v-card-text class="text-body-1 flex-grow-1 pa-4">
            <p class="description">
              {{ t('homepage.collaboration.description') }}
            </p>
          </v-card-text>
          <v-card-actions class="pa-4 mt-auto">
            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              :to="'/taskforce'"
            >
              {{ t('homepage.collaboration.button') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Events gallery -->
    <section class="mb-12 px-4">
      <v-carousel
        show-arrows="hover"
        height="400"
        hide-delimiter-background
        delimiter-icon="mdi-circle-small"
        cycle
      >
        <v-carousel-item
          v-for="(event, i) in events"
          :key="i"
        >
          <v-img
            class="align-end"
            :src="event.image"
            height="400"
            cover
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.8)"
          >
            <div class="event-caption pa-4">
              <h3 class="text-h4 text-white mb-2">{{ event.title }}</h3>
              <p class="text-subtitle-1 text-white">{{ event.description }}</p>
            </div>
          </v-img>
        </v-carousel-item>
      </v-carousel>
    </section>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SearchBoxes from '@/components/SearchBoxes.vue'

  const { t } = useI18n()

  const events = ref([
    {
      title: 'Mural Fest - Barcelona 2024',
      description: 'A global gathering of workshop facilitators',
      image: '/assets/images/events/mural-fest-barcelona.jpg',
    },
    {
      title: '1001 fresques - Lyon Nov 2024',
      description: 'Join this exceptional event in France',
      image: '/assets/images/events/1001-fresques-lyon-2024.jpg',
    },
    {
      title: 'Climate Fresk at COP28',
      description: 'Taking climate action to international level',
      image: '/assets/images/events/climate-fresk-cop28.jpg',
    },
    {
      title: '1001 fresques - Lyon 2023',
      description: "The success of last year's event",
      image: '/assets/images/events/1001-fresques-lyon-2023.jpg',
    },
    {
      title: 'Equinox festival - Stockholm 2024',
      description: 'Celebrating sustainability workshops in Scandinavia',
      image: '/assets/images/events/equinox-stockholm.jpg',
    },
  ])
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

  .greeting-banner {
    background-color: rgba(var(--v-theme-primary), 0.1);
    color: var(--v-theme-primary);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .event-caption {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    border-radius: 0 0 4px 4px;
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
    width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    min-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v-theme-primary);
  }

  .card-description {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
</style>
