<script setup>
import chatBackground from '@/assets/chat-background.svg'
import { ASSISTANT_INTRO, ASSISTANT_NAME } from '@/constants/chat.js'

/** 对话页空状态:默认背景(助手名称、介绍、背景图形)与常见问题 */
defineProps({
  /** 常见问题列表 [{ id, text }] */
  faqItems: { type: Array, required: true },
  /** 是否禁用(例如正在等待回复) */
  disabled: { type: Boolean, default: false },
})

defineEmits({
  /** 点击某个常见问题,参数为问题文本 */
  'select-faq': (text) => typeof text === 'string',
})
</script>

<template>
  <div class="empty-state">
    <img class="empty-state__image" :src="chatBackground" alt="" />
    <h2 class="empty-state__name">{{ ASSISTANT_NAME }}</h2>
    <p class="empty-state__intro">{{ ASSISTANT_INTRO }}</p>
    <ul class="empty-state__faq" aria-label="常见问题">
      <li v-for="item in faqItems" :key="item.id">
        <button
          type="button"
          class="empty-state__faq-item"
          :disabled="disabled"
          @click="$emit('select-faq', item.text)"
        >
          {{ item.text }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6) var(--space-4);
  text-align: center;
}

// 手机端背景图形不超过内容区宽度的 60%;平板及以上放宽
.empty-state__image {
  width: 100%;
  max-width: 60%;
  margin-bottom: var(--space-4);

  @media #{$mq-tablet-up} {
    max-width: 320px;
  }
}

.empty-state__name {
  margin: 0 0 var(--space-2);
  color: var(--color-text);
  font-size: var(--font-size-title);
}

.empty-state__intro {
  max-width: 480px;
  margin: 0 0 var(--space-4);
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

// 手机 1 列,平板及以上 2 列
.empty-state__faq {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--touch-gap-min);
  width: 100%;
  max-width: 640px;
  padding: 0;
  margin: 0;
  list-style: none;

  @media #{$mq-tablet-up} {
    grid-template-columns: repeat(2, 1fr);
  }
}

.empty-state__faq-item {
  width: 100%;
  min-height: var(--touch-target-min);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  font: inherit;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
