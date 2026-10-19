<script setup>
import { computed } from 'vue'
import { MESSAGES } from '@/constants/messages.js'
import { formatTripSummary } from '@/utils/plan.js'

/** 平板/手机端顶部的旅程摘要条:渲染为按钮,点击后打开旅程摘要抽屉 */
const props = defineProps({
  /** 旅程表单值 { destination, budget, travelerCount } */
  trip: { type: Object, required: true },
})

const emit = defineEmits({
  /** 点击、Enter 或空格时触发,参数为触发元素,用于关闭抽屉后归还焦点 */
  open: (el) => el === null || el instanceof HTMLElement,
})

const summary = computed(() => formatTripSummary(props.trip))
const text = computed(() => {
  if (summary.value.empty) return MESSAGES.NO_TRIP_INFO
  const { destination, budget, travelerCount } = summary.value
  return `${destination} · ${budget} · ${travelerCount}`
})

/**
 * 通知父级打开抽屉。
 *
 * @param {MouseEvent} event 点击事件(Enter 与空格会被浏览器转换为按钮的点击事件)
 */
function handleClick(event) {
  emit('open', event.currentTarget)
}
</script>

<template>
  <button type="button" class="summary-bar" aria-haspopup="dialog" @click="handleClick">
    <el-icon><Suitcase /></el-icon>
    <span class="summary-bar__text">{{ text }}</span>
    <el-icon class="summary-bar__arrow"><ArrowRight /></el-icon>
  </button>
</template>

<style scoped>
.summary-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  min-height: var(--touch-target-min);
  padding: 0 var(--space-3);
  color: var(--color-text);
  font: inherit;
  text-align: left;
  background: var(--color-primary-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.summary-bar__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-bar__arrow {
  color: var(--color-text-secondary);
}
</style>
