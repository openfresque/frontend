<template>
  <div class="qa-container">
    <!-- title -->
    <div class="qa-title">
      <h2 class="text-h2 text-primary mb-6">{{ t('qa.title') }}</h2>
      <p>{{ t('qa.description') }}</p>
    </div>

    <!-- items -->
    <div class="qa-items">
      <div
        v-for="key in qaSections"
        :key="key"
      >
        <h3 v-html="t(`qa.sections.${key}.title`)"></h3>
        <p v-html="t(`qa.sections.${key}.description`)"></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const qaSections = [
    'interest',
    'functionality',
    'non_profit',
    'support',
    'help',
  ]
</script>

<style scoped>
  .qa-container {
    padding: 20px;
  }

  .qa-item {
    margin-bottom: 10px;
  }

  .qa-item h3 {
    cursor: pointer;
    color: #42b983;
  }

  .qa-item p {
    margin: 0;
    padding: 0 10px;
  }
</style>
