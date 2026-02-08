<template>
  <v-app class="app-container">
    <AppBar />
    <v-main :class="['main-content', { 'is-map-page': route.name === 'map' }]">
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<style lang="scss" scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; // Ensure app takes at least full viewport height
  }

  .main-content {
    flex-grow: 1; // Make main content area fill available vertical space
    display: flex; // Needed for nested content potentially
    flex-direction: column; // Needed for nested content potentially

    // Default padding for non-map pages
    padding-top: 64px; // Adjust based on AppBar height
    padding-left: 16px;
    padding-right: 16px;
  }

  .is-map-page {
    padding: 0 !important;
    height: 100vh;
    width: 100vw;
    position: fixed; // Keep fixed for fullscreen map
    top: 0;
    left: 0;
    z-index: 10; // Ensure it covers header/footer visually
    flex-grow: 0; // Override flex-grow when map is active
  }

  // Hide footer specifically on map page
  .is-map-page + footer {
    display: none;
  }

  /* Ensure footer doesn't grow */
  footer {
    flex-shrink: 0;
  }

  // Mobile: reduce edge padding on main content
  @media (max-width: 576px) {
    .main-content {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
