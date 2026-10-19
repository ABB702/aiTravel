<script setup>
import { computed } from 'vue'
import { MESSAGES } from '@/constants/messages.js'
import { formatTripSummary } from '@/utils/plan.js'

/** 旅程摘要:AsidePanel、AsideDrawer 共用;无任何旅程信息时显示占位文案 */
const props = defineProps({
  /** 旅程表单值 { destination, budget, travelerCount } */
  trip: { type: Object, required: true },
})

const summary = computed(() => formatTripSummary(props.trip))
</script>

<template>
  <p v-if="summary.empty" class="trip-summary__empty">{{ MESSAGES.NO_TRIP_INFO }}</p>
  <dl v-else class="trip-summary">
    <div class="trip-summary__row">
      <dt>目的地</dt>
      <dd>{{ summary.destination }}</dd>
    </div>
    <div class="trip-summary__row">
      <dt>预算</dt>
      <dd>{{ summary.budget }}</dd>
    </div>
    <div class="trip-summary__row">
      <dt>人数</dt>
      <dd>{{ summary.travelerCount }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.trip-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
}

.trip-summary__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.trip-summary dt {
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
}

.trip-summary dd {
  margin: 0;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.trip-summary__empty {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
