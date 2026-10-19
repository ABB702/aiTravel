<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import assistantAvatar from '@/assets/assistant-avatar.svg'
import userAvatar from '@/assets/user-avatar.svg'
import { ASSISTANT_AVATAR_ALT, USER_AVATAR_ALT } from '@/constants/chat.js'
import { MESSAGE_ROLE, MESSAGE_STATUS, MESSAGE_STATUS_LABEL } from '@/constants/message.js'
import { copyText } from '@/utils/clipboard.js'

/**
 * 消息气泡:用户消息靠右、助手消息靠左,旁边显示头像。
 * 内容以文本方式渲染(不使用 v-html),右键菜单可复制内容。
 */
const props = defineProps({
  /** 消息 { id, role, content, timestamp, status } */
  message: { type: Object, required: true },
})

defineEmits({
  /** 点击"重试",参数为消息 ID */
  retry: (messageId) => typeof messageId === 'string',
})

const isUser = computed(() => props.message.role === MESSAGE_ROLE.USER)
const isFailed = computed(() => props.message.status === MESSAGE_STATUS.FAILED)
const avatarSrc = computed(() => (isUser.value ? userAvatar : assistantAvatar))
const avatarAlt = computed(() => (isUser.value ? USER_AVATAR_ALT : ASSISTANT_AVATAR_ALT))
const statusLabel = computed(() => MESSAGE_STATUS_LABEL[props.message.status] ?? '')

/** 右键菜单"复制":复制消息内容并给出结果提示 */
async function handleCommand(command) {
  if (command !== 'copy') return
  const ok = await copyText(props.message.content)
  if (ok) ElMessage.success('已复制')
  else ElMessage.error('复制失败')
}
</script>

<template>
  <el-dropdown class="message-wrap" trigger="contextmenu" @command="handleCommand">
    <div class="message" :class="isUser ? 'message--user' : 'message--assistant'">
      <img class="message__avatar" :src="avatarSrc" :alt="avatarAlt" />
      <div class="message__main">
        <div class="message__bubble">{{ message.content }}</div>
        <div v-if="isUser" class="message__status" :class="{ 'is-failed': isFailed }">
          <span>{{ statusLabel }}</span>
          <el-button
            v-if="isFailed"
            type="danger"
            link
            size="small"
            aria-label="重试发送"
            @click.stop="$emit('retry', message.id)"
          >
            重试
          </el-button>
        </div>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="copy">复制</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.message-wrap {
  display: block;
  width: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin: var(--space-2) 0;
}

.message--user {
  flex-direction: row-reverse;
}

.message__avatar {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

// 手机气泡最大宽度 80%,平板及以上 70%
.message__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 80%;

  @media #{$mq-tablet-up} {
    max-width: 70%;
  }
}

.message--user .message__main {
  align-items: flex-end;
}

.message__bubble {
  position: relative;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  line-height: 1.6;
  text-align: left;
  // 保留换行并让连续长文本在气泡内折行
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  border-radius: var(--radius-md);

  // 气泡尾巴:用伪元素画三角,指向头像
  &::before {
    position: absolute;
    top: var(--space-3);
    width: 0;
    height: 0;
    content: '';
    border-style: solid;
  }
}

.message--assistant .message__bubble {
  background: var(--bubble-assistant-bg);

  &::before {
    left: calc(-1 * var(--space-2));
    border-color: transparent var(--bubble-assistant-bg) transparent transparent;
    border-width: var(--space-2) var(--space-2) var(--space-2) 0;
  }
}

.message--user .message__bubble {
  background: var(--bubble-user-bg);

  &::before {
    right: calc(-1 * var(--space-2));
    border-color: transparent transparent transparent var(--bubble-user-bg);
    border-width: var(--space-2) 0 var(--space-2) var(--space-2);
  }
}

.message__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);

  &.is-failed {
    color: var(--color-danger);
  }
}
</style>
