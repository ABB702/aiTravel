<script setup>
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SummaryBar from '@/components/layout/SummaryBar.vue'
import { useAsideDrawer } from '@/composables/useAsideDrawer.js'
import { useChatScroll } from '@/composables/useChatScroll.js'
import { useLayoutMode } from '@/composables/useLayoutMode.js'
import { useViewportHeightState } from '@/composables/useViewportHeight.js'
import { FAQ_ITEMS } from '@/constants/faq.js'
import { useChatStore } from '@/stores/chat.js'
import { usePlanStore } from '@/stores/plan.js'
import { buildChatItems } from '@/utils/chat.js'
import EmptyState from './components/EmptyState.vue'
import MessageInput from './components/MessageInput.vue'
import MessageList from './components/MessageList.vue'

/** 对话页:无消息时显示空状态(常见问题),有消息时显示聊天视图 */
const chatStore = useChatStore()
const planStore = usePlanStore()
const { flags } = useLayoutMode()
const { open: openDrawer } = useAsideDrawer()
const viewportHeight = useViewportHeightState()

const scrollRef = ref(null)
const items = computed(() => buildChatItems(chatStore.messages))

// 新增消息或回复状态变化后滚动到底部
const { scrollToBottom } = useChatScroll(scrollRef, [
  () => chatStore.messages.length,
  () => chatStore.isReplying,
])

// 软键盘弹出会使可视视口变矮,此时把最新消息滚动到可见位置
watch(viewportHeight, (height, previous) => {
  if (height < previous) scrollToBottom()
})
</script>

<template>
  <div class="chat-page">
    <div v-if="flags.showSummaryBar" class="chat-page__summary">
      <SummaryBar :trip="planStore.plan" @open="openDrawer" />
    </div>
    <div class="chat-page__bar">
      <PageHeader title="对话" />
      <el-button @click="chatStore.createSession()">新对话</el-button>
    </div>
    <div ref="scrollRef" class="chat-page__body">
      <EmptyState
        v-if="chatStore.isEmpty"
        :faq-items="FAQ_ITEMS"
        :disabled="chatStore.isReplying"
        @select-faq="chatStore.sendUserMessage"
      />
      <MessageList
        v-else
        :items="items"
        :replying="chatStore.isReplying"
        @retry="chatStore.retry"
      />
    </div>
    <MessageInput :disabled="chatStore.isReplying" @send="chatStore.sendUserMessage" />
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.chat-page__summary {
  flex: none;
  padding: var(--space-2) var(--space-4) 0;
}

.chat-page__bar {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4) var(--space-1);
}

.chat-page__bar :deep(.page-header) {
  margin-bottom: 0;
}

.chat-page__body {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
