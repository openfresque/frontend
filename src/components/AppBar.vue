<template>
  <v-app-bar flat>
    <div :class="['inner-app-bar d-flex align-center justify-space-between w-100', smAndDown ? 'px-2' : 'px-4']">
      <!-- main logo -->
      <router-link to="/">
        <v-img
          alt="TUF logo"
          :src="currentLogo"
          width="180"
          max-height="40"
          contain
        />
      </router-link>

      <!-- navigation links (for md devices and bigger) -->
      <div class="d-none d-md-flex align-center">
        <template v-for="link in links" :key="link.id">
          <!-- Regular Button -->
          <v-btn
            v-if="!link.children"
            v-bind="link.external ? { href: link.href } : { to: link.to }"
            :target="link.external ? '_blank' : undefined"
            variant="text"
            class="mx-1"
            :append-icon="link.icon"
          >
            {{ t(link.textKey) }}
          </v-btn>

          <!-- Dropdown Menu -->
          <v-menu v-else open-on-hover>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="mx-1"
                :append-icon="link.icon || 'mdi-chevron-down'"
              >
                {{ t(link.textKey) }}
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="child in link.children"
                :key="child.id"
                :prepend-icon="child.icon"
                :title="t(child.textKey)"
                v-bind="child.external ? { href: child.href, target: '_blank' } : { to: child.to }"
              >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        
        <LanguageSwitcher class="ml-2" />
      </div>

      <!-- navigation links (for small devices) -->
      <v-menu v-model="menu" location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="d-flex d-md-none"
            icon="mdi-menu"
          >
          </v-btn>
        </template>
        <v-list>
          <template v-for="link in links" :key="link.id + '-mobile'">
            <!-- Regular Mobile Item -->
            <v-list-item
              v-if="!link.children"
              v-bind="link.external ? { href: link.href } : { to: link.to }"
              :target="link.external ? '_blank' : undefined"
              @click="menu = false"
              :append-icon="link.icon"
              color="primary"
              :title="t(link.textKey)"
            >
            </v-list-item>
            <!-- Mobile Sub-items (flattened) -->
            <template v-else>
               <!-- Optional: Add a non-clickable header for the group -->
               <v-list-subheader>{{ t(link.textKey) }}</v-list-subheader> 
               <v-list-item
                 v-for="child in link.children"
                 :key="child.id"
                 @click="menu = false"
                 :append-icon="child.icon"
                 color="primary"
                 :title="t(child.textKey)"
                 class="ml-4"
                 v-bind="child.external ? { href: child.href, target: '_blank' } : { to: child.to }"
               >
               </v-list-item>
            </template>
          </template>

          <v-divider class="my-2" />
          
          <v-list-item @click.stop>
            <div class="px-3 py-2 w-100">
              <LanguageSwitcher />
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useTheme, useDisplay } from 'vuetify'
  import { useI18n } from 'vue-i18n'
  import LanguageSwitcher from './LanguageSwitcher.vue'
  import { RouteLocationRaw } from 'vue-router'

  // Define the interface for navigation links
  interface NavLink {
    id: number;
    to?: RouteLocationRaw;
    href?: string; // Add href for external URLs
    textKey: string;
    icon?: string;
    external?: boolean;
    children?: NavLink[];
  }

  const { t } = useI18n()

  const menu = ref(false)

  const links = computed<NavLink[]>(() => [
    /* Home link commented out
    {
      id: 1,
      to: '/',
      textKey: 'navigation.home',
      icon: 'mdi-home',
    },
    */
    {
      id: 2,
      to: '/find-a-fresk',
      textKey: 'navigation.findAFresk',
      icon: 'mdi-magnify',
    },
    {
      id: 3,
      to: '/carte',
      textKey: 'navigation.map',
      icon: 'mdi-map'
    },
    {
      id: 4,
      textKey: 'navigation.community',
      icon: 'mdi-account-group',
      children: [
        {
          id: 51,
          to: '/local-groups',
          textKey: 'navigation.localGroups',
          icon: 'mdi-map-marker-radius'
        },
        {
          id: 52,
          to: '/taskforce',
          textKey: 'navigation.taskforce',
          icon: 'mdi-information-outline'
        },
        {
          id: 53,
          to: '/lets-talk-about-it',
          textKey: 'navigation.talkAboutIt',
          icon: 'mdi-chat',
        },
        {
          id: 54,
          href: 'https://www.linkedin.com/company/trouver-une-fresque',
          textKey: 'navigation.communityNews',
          icon: 'mdi-newspaper-variant-outline',
          external: true
        },
      ]
    }
  ])

  const { smAndDown } = useDisplay()
  const theme = useTheme()

  const currentLogo = computed(() => {
    return theme.global.current.value.dark
      ? '/assets/images/svg/tuf-logo-landscape-fr.webp'
      : '/assets/images/svg/tuf-logo-landscape-fr.webp'
  })
</script>

<style scoped lang="sass">
  .toolbar-content
    max-width: 1200px
    width: 100%
    height: 100%
    margin: 0 auto
    position: relative
    
  .navigation-container
    display: inline-block
    
  .language-container
    margin-left: 16px
    height: 100%
    align-items: center
</style>
