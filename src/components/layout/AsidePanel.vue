<script setup>
import TripSummary from './TripSummary.vue'

/** 桌面端右侧辅助信息栏:显示当前旅程摘要 */
defineProps({
  /** 旅程表单值 { destination, budget, travelerCount } */
  trip: { type: Object, required: true },
})
</script>

<template>
  <aside class="aside-panel" aria-label="旅程摘要">
    <h2 class="aside-panel__title">旅程摘要</h2>
    <TripSummary :trip="trip" />
  </aside>
</template>

<style scoped>
.aside-panel {
  flex: 0 0 var(--aside-width);
  width: var(--aside-width);
  padding: var(--space-4);
  overflow-y: auto;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
}

.aside-panel__title {
  margin: 0 0 var(--space-4);
  color: var(--color-text);
  font-size: var(--font-size-subtitle);
  font-weight: 600;
}
</style>
