<template>
  <div class="language-switcher">
    <select
      class="language-select"
      @change="switchLanguage"
    >
      <option
        v-for="sLocale in supportedLocales"
        :key="`locale-${sLocale}`"
        :value="sLocale"
        :selected="locale === sLocale"
      >
        {{ t(`locale.${sLocale}`) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Translation from '@/i18n/translation'

  const { t, locale } = useI18n()
  const supportedLocales = Translation.supportedLocales
  const router = useRouter()

  async function switchLanguage(event: Event) {
    const target = event.target as HTMLSelectElement
    const newLocale = target.value
    await Translation.switchLanguage(newLocale)

    try {
      await router.replace({ params: { locale: newLocale } })
    } catch (error) {
      console.error(error)
      router.push('/')
    }
  }
</script>

<style scoped>
  .language-switcher {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .language-select {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    background-color: transparent;
    color: rgb(var(--v-theme-on-surface));
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    transition: border-color 0.3s;
    min-height: 36px;
    width: 100%;
  }

  .language-select:hover {
    border-color: rgb(var(--v-theme-primary));
  }
</style>
