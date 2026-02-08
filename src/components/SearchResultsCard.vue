<template>
  <v-card
    class="workshop-card my-4"
    elevation="2"
  >
    <v-card-text>
      <v-row>
        <!-- logo -->
        <v-col
          class="d-flex justify-center align-center"
          cols="12"
          sm="3"
          md="2"
        >
          <div class="logo-container">
            <v-img
              :src="getWorkshopLogo(workshop)"
              :alt="getWorkshopTitle(workshop)"
              width="96px"
              height="96px"
              contain
            ></v-img>
          </div>
        </v-col>

        <!-- workshop description -->
        <v-col
          cols="12"
          sm="9"
          md="6"
        >
          <v-card-title>
            {{ props.title || getWorkshopTitle(workshop) }}
          </v-card-title>
          <v-card-subtitle>
            {{ getWorkshopDate(workshop) }}
          </v-card-subtitle>
          <v-card-text class="text-address">
            {{ getWorkshopAdress(workshop)
            }}<span v-if="props.international && !workshop.online">
              {{ getFlagEmoji(props.countryCode, 'country') }}</span
            >
          </v-card-text>
          <v-card-text
            class="text-language"
            v-if="props.international"
          >
            Language: {{ getFlagEmoji(props.languageCode, 'language') }}
          </v-card-text>
        </v-col>

        <!-- resercation btn -->
        <v-col
          class="d-flex justify-center align-center"
          cols="12"
          sm="12"
          md="4"
        >
          <v-btn
            class="d-none d-sm-flex"
            :color="workshop.sold_out ? 'sold-out' : 'primary'"
            :href="workshop.source_link"
            target="_blank"
            size="large"
          >
            {{
              workshop.sold_out
                ? t('resultsListing.soldOut')
                : t('resultsListing.book')
            }}
          </v-btn>
          <v-btn
            class="d-sm-none"
            :color="workshop.sold_out ? 'sold-out' : 'primary'"
            :href="workshop.source_link"
            target="_blank"
            size="large"
          >
            {{
              workshop.sold_out
                ? t('resultsListing.soldOut')
                : t('resultsListing.bookShort')
            }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ATELIERS, Workshop } from '@/common/Conf'
  import { useI18n } from 'vue-i18n'
  import { getFlagEmoji } from '@/utils/flagEmoji'

  const { t } = useI18n()

  const props = defineProps({
    workshop: {
      type: Object as PropType<Workshop>,
      required: true,
    },
    workshopTypeTitle: {
      type: String,
      required: false,
      default: 'Atelier',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    international: {
      type: Boolean,
      required: false,
      default: false,
    },
    languageCode: {
      type: String,
      required: false,
      default: '',
    },
    countryCode: {
      type: String,
      required: false,
      default: '',
    },
  })

  function getWorkshopTitle(workshop: Workshop): string {
    return (
      props.workshopTypeTitle.toUpperCase()[0] +
      props.workshopTypeTitle.slice(1).toLowerCase() +
      ' ' +
      ATELIERS[workshop.workshop_type].name
    )
  }

  function getWorkshopDate(workshop: Workshop): string {
    return new Date(workshop.start_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  function getWorkshopAdress(workshop: Workshop): string {
    if (workshop.online) {
      return t('resultsListing.online')
    }

    let ret = ''
    if (workshop.location_name) {
      if (workshop.location_name !== workshop.address) {
        ret += workshop.location_name + ', '
      }
    }
    if (workshop.address) {
      ret += workshop.address + ', '
    }
    if (workshop.city) {
      ret += workshop.city + ' '
    }
    if (workshop.zip_code) {
      ret += '(' + workshop.zip_code + ')'
    }
    return ret
  }

  function getWorkshopLogo(workshop: Workshop): string {
    return ATELIERS[workshop.workshop_type].logo
  }

  onMounted(() => {})
</script>

<style scoped>
  .v-card-title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: normal;

    @media screen and (max-width: 960px) {
      font-size: 1.25rem;
    }

    @media screen and (max-width: 600px) {
      font-size: 1rem;
      white-space: wrap;
    }
  }

  .v-card-subtitle {
    font-size: 1.25rem;
    line-height: normal;
    font-weight: bold;

    @media screen and (max-width: 960px) {
      font-size: 1.05rem;
    }

    @media screen and (max-width: 600px) {
      font-size: 0.95rem;
      white-space: wrap;
    }
  }

  .text-address {
    font-size: 1.05rem;
    line-height: normal;
    font-weight: 500;

    @media screen and (max-width: 960px) {
      font-size: 0.95rem;
    }

    @media screen and (max-width: 600px) {
      font-size: 0.85rem;
    }
  }
</style>

<style>
  @import '@/styles/logo-container.scss';
</style>
