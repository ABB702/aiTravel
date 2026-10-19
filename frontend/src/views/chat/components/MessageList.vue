<script setup>
import MessageBubble from './MessageBubble.vue'
import TimeDivider from './TimeDivider.vue'
import TypingIndicator from './TypingIndicator.vue'

/** 消息列表:渲染时间分隔标签与消息气泡,等待回复时末尾显示输入中提示 */
defineProps({
  /** 由 buildChatItems 生成的列表项 */
  items: { type: Array, required: true },
  /** 是否正在等待助手回复 */
  replying: { type: Boolean, default: false },
})

defineEmits({
  /** 重试某条失败的消息,参数为消息 ID */
  retry: (messageId) => typeof messageId === 'string',
})
</script>

<template>
  <div class="message-list">
    <template v-for="item in items" :key="item.key">
      <TimeDivider v-if="item.type === 'divider'" :label="item.label" />
      <MessageBubble v-else :message="item.message" @retry="$emit('retry', $event)" />
    </template>
    <TypingIndicator v-if="replying" />
  </div>
</template>

<style scoped>
.message-list {
  padding: var(--space-2) var(--space-4);
}
</style>
