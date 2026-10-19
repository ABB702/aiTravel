<script setup>
/** 聊天列表中的时间分隔标签,居中显示 */
defineProps({
  /** 时间文案,由 formatChatTime 生成 */
  label: { type: String, required: true },
})
</script>

<template>
  <div class="time-divider">
    <span class="time-divider__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.time-divider {
  display: flex;
  justify-content: center;
  margin: var(--space-3) 0;
}

.time-divider__label {
  padding: var(--space-1) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  background: var(--color-border);
  border-radius: var(--radius-lg);
}
</style>
