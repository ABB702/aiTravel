<script setup>
import { computed, nextTick, ref } from 'vue'
import { isBlank } from '@/utils/validators.js'

/**
 * 聊天输入区:文本框与"发送"按钮位于同一行。
 * Enter 发送,Shift+Enter 换行;输入法组合输入(IME)期间的 Enter 不会发送。
 */
const props = defineProps({
  /** 是否禁用(例如正在等待回复) */
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits({
  /** 发送消息,参数为输入内容 */
  send: (content) => typeof content === 'string',
})

const content = ref('')
const inputRef = ref(null)

const canSend = computed(() => !props.disabled && !isBlank(content.value))

/** 发送并清空输入框,保持焦点 */
async function send() {
  if (!canSend.value) return
  emit('send', content.value)
  content.value = ''
  await nextTick()
  inputRef.value?.focus()
}

/**
 * 处理按键:Enter(未按 Shift 且不在输入法组合中)发送。
 *
 * @param {KeyboardEvent} event 键盘事件
 */
function handleEnter(event) {
  if (event.shiftKey || event.isComposing) return
  event.preventDefault()
  send()
}
</script>

<template>
  <div class="message-input">
    <el-input
      ref="inputRef"
      v-model="content"
      class="message-input__field"
      type="textarea"
      :autosize="{ minRows: 1, maxRows: 4 }"
      placeholder="输入消息,Enter 发送,Shift+Enter 换行"
      aria-label="消息内容"
      @keydown.enter="handleEnter"
    />
    <el-button type="primary" class="message-input__send" :disabled="!canSend" @click="send">
      发送
    </el-button>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.message-input__field {
  flex: 1;
  min-width: 0;
}

.message-input__send {
  flex: none;
}
</style>
