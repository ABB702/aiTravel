<script setup>
import assistantAvatar from '@/assets/assistant-avatar.svg'
import { ASSISTANT_AVATAR_ALT } from '@/constants/chat.js'

/** 助手正在输入的提示:三点动画,读屏软件会播报"助手正在输入" */
</script>

<template>
  <div class="typing-indicator" role="status">
    <img class="typing-indicator__avatar" :src="assistantAvatar" :alt="ASSISTANT_AVATAR_ALT" />
    <div class="typing-indicator__bubble" aria-hidden="true">
      <span class="typing-indicator__dot" />
      <span class="typing-indicator__dot" />
      <span class="typing-indicator__dot" />
    </div>
    <span class="typing-indicator__sr">助手正在输入</span>
  </div>
</template>

<style scoped>
.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  margin: var(--space-2) 0;
}

.typing-indicator__avatar {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.typing-indicator__bubble {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-3);
  background: var(--bubble-assistant-bg);
  border-radius: var(--radius-md);
}

.typing-indicator__dot {
  width: 8px;
  height: 8px;
  background: var(--color-text-secondary);
  border-radius: 50%;
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-indicator__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator__dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* 仅供读屏软件读取 */
.typing-indicator__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    opacity: 0.4;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-indicator__dot {
    animation: none;
  }
}
</style>
