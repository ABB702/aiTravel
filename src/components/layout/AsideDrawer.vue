<script setup>
import { computed } from 'vue'
import { LAYOUT_MODE } from '@/constants/breakpoints.js'
import { useAsideDrawer } from '@/composables/useAsideDrawer.js'
import { useLayoutMode } from '@/composables/useLayoutMode.js'
import TripSummary from './TripSummary.vue'

/**
 * 平板/手机端的旅程摘要抽屉。
 * Esc、点击遮罩与关闭按钮均由 ElDrawer 提供;焦点陷阱与焦点返回也依赖 ElDrawer,
 * closed 事件中再用记录的触发元素兜底归还焦点。
 */
defineProps({
  /** 是否打开 */
  modelValue: { type: Boolean, default: false },
  /** 旅程表单值 { destination, budget, travelerCount } */
  trip: { type: Object, required: true },
})

defineEmits(['update:modelValue'])

const { mode } = useLayoutMode()
const { restoreFocus } = useAsideDrawer()

// 平板固定 360px 宽,手机占屏幕宽度的 85%
const size = computed(() => (mode.value === LAYOUT_MODE.TABLET ? '360px' : '85%'))
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    title="旅程摘要"
    direction="rtl"
    :size="size"
    append-to-body
    @update:model-value="$emit('update:modelValue', $event)"
    @closed="restoreFocus"
  >
    <TripSummary :trip="trip" />
  </el-drawer>
</template>
