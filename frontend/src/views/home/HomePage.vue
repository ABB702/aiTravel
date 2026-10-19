<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageCard from '@/components/common/PageCard.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SummaryBar from '@/components/layout/SummaryBar.vue'
import { useAsideDrawer } from '@/composables/useAsideDrawer.js'
import { useLayoutMode } from '@/composables/useLayoutMode.js'
import { RECOMMENDED_DESTINATIONS } from '@/constants/destinations.js'
import { ROUTE_PATHS } from '@/constants/routes.js'
import { useChatStore } from '@/stores/chat.js'
import { usePlanStore } from '@/stores/plan.js'
import DestinationCard from './components/DestinationCard.vue'
import PlanForm from './components/PlanForm.vue'

/** 首页:填写旅程信息、选择推荐目的地,点击"开始规划"后进入对话页 */
const router = useRouter()
const planStore = usePlanStore()
const chatStore = useChatStore()
const { flags } = useLayoutMode()
const { open: openDrawer } = useAsideDrawer()

/** 字段错误提示,由 PlanForm 校验失败时写入 */
const errors = ref({})
/** 是否正在提交 */
const submitting = ref(false)

// 表单值直接绑定到 Plan_Store,修改后辅助信息栏立即同步
const form = computed({
  get: () => planStore.plan,
  set: (value) => planStore.update(value),
})

/**
 * 清除某个字段的错误提示。
 *
 * @param {string} field 字段名
 */
function clearError(field) {
  const next = { ...errors.value }
  delete next[field]
  errors.value = next
}

/**
 * 选择推荐目的地:覆盖已有目的地,并清除目的地错误。
 *
 * @param {string} name 目的地名称
 */
function selectDestination(name) {
  planStore.update({ destination: name })
  clearError('destination')
}

/**
 * 校验通过后开始规划:新建会话发送规划请求,并跳转到对话页。
 *
 * @param {{ destination: string, budget: number, travelerCount: number }} plan 有效的表单值
 */
async function startPlan(plan) {
  submitting.value = true
  try {
    // 回复在对话页中异步到达,这里不等待
    chatStore.startPlan(plan)
    await router.push(ROUTE_PATHS.CHAT)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page-container home-page">
    <SummaryBar v-if="flags.showSummaryBar" :trip="planStore.plan" @open="openDrawer" />
    <PageHeader
      title="规划你的下一次旅程"
      subtitle="告诉我目的地、预算和人数,AI 助手帮你安排行程"
    />
    <PageCard>
      <PlanForm
        v-model="form"
        :submitting="submitting"
        :errors="errors"
        @invalid="errors = $event"
        @clear-error="clearError"
        @submit="startPlan"
      />
    </PageCard>
    <section class="home-page__recommend" aria-labelledby="recommend-title">
      <h2 id="recommend-title" class="home-page__subtitle">推荐目的地</h2>
      <div class="home-page__grid">
        <DestinationCard
          v-for="destination in RECOMMENDED_DESTINATIONS"
          :key="destination.id"
          :destination="destination"
          :selected="planStore.destination === destination.name"
          @select="selectDestination"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.home-page__subtitle {
  margin: 0 0 var(--space-3);
  color: var(--color-text);
  font-size: var(--font-size-subtitle);
  font-weight: 600;
}

// 移动端优先:1 列 -> 平板 2 列 -> 桌面 3 列
.home-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--touch-gap-min);

  @media #{$mq-tablet-up} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  @media #{$mq-desktop-up} {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
