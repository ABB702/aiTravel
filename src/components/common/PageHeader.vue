<script setup>
/** 页面标题:三个页面共用,保证标题样式一致 */
defineProps({
  /** 主标题 */
  title: { type: String, required: true },
  /** 副标题(可选) */
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--space-4);
}

.page-header__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-title);
  font-weight: 600;
  line-height: 1.4;
}

.page-header__subtitle {
  margin: var(--space-1) 0 0;
  color: var(--color-text-secondary);
}
</style>
