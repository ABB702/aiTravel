import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createEmptyPlan, hasTripInfo as checkTripInfo } from '@/utils/plan.js'

/**
 * 旅程规划 Store:保存首页表单的当前值,供首页与辅助信息栏共享。
 * 所有更新都是同步的,保证摘要在 300ms 内刷新。
 */
export const usePlanStore = defineStore('plan', () => {
  const initial = createEmptyPlan()

  /** 旅程目的地 */
  const destination = ref(initial.destination)
  /** 预算(元),未填写为 null */
  const budget = ref(initial.budget)
  /** 出行人数,未填写为 null */
  const travelerCount = ref(initial.travelerCount)

  /** 当前表单值 */
  const plan = computed(() => ({
    destination: destination.value,
    budget: budget.value,
    travelerCount: travelerCount.value,
  }))

  /** 是否已填写任何旅程信息 */
  const hasTripInfo = computed(() => checkTripInfo(plan.value))

  /**
   * 增量更新表单字段,仅处理 destination、budget、travelerCount。
   *
   * @param {{ destination?: string, budget?: number | null, travelerCount?: number | null }} patch 要更新的字段
   */
  function update(patch) {
    if (!patch) return
    if ('destination' in patch) destination.value = patch.destination
    if ('budget' in patch) budget.value = patch.budget
    if ('travelerCount' in patch) travelerCount.value = patch.travelerCount
  }

  /** 恢复为初始空值 */
  function reset() {
    const empty = createEmptyPlan()
    destination.value = empty.destination
    budget.value = empty.budget
    travelerCount.value = empty.travelerCount
  }

  return { destination, budget, travelerCount, plan, hasTripInfo, update, reset }
})
