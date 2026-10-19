import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { sendChatMessage } from '@/api/chat.js'
import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants/message.js'
import { createEmptySession, createMessage } from '@/utils/chat.js'
import { loadSession, saveSession } from '@/utils/chatStorage.js'
import { buildPlanRequestText } from '@/utils/plan.js'
import { isBlank } from '@/utils/validators.js'

/**
 * 对话 Store:管理当前会话与消息,并把会话持久化到本地存储。
 * 只维护"当前会话",不保留历史会话列表。
 */
export const useChatStore = defineStore('chat', () => {
  /** 当前会话,启动时从本地存储恢复 */
  const session = ref(loadSession())
  /** 正在等待回复的会话 ID;为 null 表示没有进行中的请求 */
  const replyingSessionId = ref(null)

  /** 当前会话的消息列表 */
  const messages = computed(() => session.value.messages)
  /** 当前会话是否没有任何消息 */
  const isEmpty = computed(() => session.value.messages.length === 0)
  /** 当前会话是否正在等待助手回复 */
  const isReplying = computed(() => replyingSessionId.value === session.value.id)

  // 会话变化(含消息增删与状态变化)时写入本地存储;写入失败不影响内存数据
  watch(session, (value) => saveSession(value), { deep: true })

  /** 新建会话,替换当前会话;进行中的旧请求结果会被丢弃 */
  function createSession() {
    session.value = createEmptySession()
    replyingSessionId.value = null
  }

  /**
   * 为指定的用户消息请求助手回复。
   * 成功:消息置为 sent 并追加助手消息;失败:消息置为 failed;
   * 请求期间会话被替换时,丢弃结果,不修改当前会话。
   *
   * @param {string} messageId 用户消息 ID
   * @returns {Promise<void>}
   */
  async function requestReply(messageId) {
    const sessionId = session.value.id
    const index = session.value.messages.findIndex((message) => message.id === messageId)
    if (index < 0) return

    session.value.messages[index].status = MESSAGE_STATUS.SENDING
    replyingSessionId.value = sessionId

    // 上下文为直到该用户消息(含)的全部消息;传入快照,避免请求过程中被响应式数据影响
    const context = session.value.messages.slice(0, index + 1).map((message) => ({ ...message }))

    try {
      const reply = await sendChatMessage(context)
      if (session.value.id !== sessionId) return
      const target = session.value.messages.find((message) => message.id === messageId)
      if (target) target.status = MESSAGE_STATUS.SENT
      session.value.messages.push(reply)
    } catch {
      if (session.value.id !== sessionId) return
      const target = session.value.messages.find((message) => message.id === messageId)
      if (target) target.status = MESSAGE_STATUS.FAILED
    } finally {
      if (replyingSessionId.value === sessionId) replyingSessionId.value = null
    }
  }

  /**
   * 发送一条用户消息并请求回复。
   * 内容为空白或正在等待回复时不做任何修改。
   *
   * @param {string} content 消息内容
   * @returns {Promise<void>} 回复完成(或失败)后结束
   */
  async function sendUserMessage(content) {
    if (isBlank(content) || isReplying.value) return

    const message = createMessage({
      role: MESSAGE_ROLE.USER,
      content: content.trim(),
      status: MESSAGE_STATUS.SENDING,
    })
    session.value.messages.push(message)
    await requestReply(message.id)
  }

  /**
   * 重试发送失败的用户消息。
   * 仅当消息存在、角色为用户且状态为 failed 时生效;正在等待回复时忽略。
   * 较早消息重试成功后,助手回复追加到消息列表末尾。
   *
   * @param {string} messageId 用户消息 ID
   * @returns {Promise<void>}
   */
  async function retry(messageId) {
    if (isReplying.value) return
    const target = session.value.messages.find((message) => message.id === messageId)
    if (!target || target.role !== MESSAGE_ROLE.USER || target.status !== MESSAGE_STATUS.FAILED) {
      return
    }
    await requestReply(messageId)
  }

  /**
   * 开始一次旅程规划:新建会话,并以规划请求文本作为第一条用户消息发送。
   *
   * @param {{ destination: string, budget: number, travelerCount: number }} plan 有效的表单值
   * @returns {Promise<void>} 回复完成(或失败)后结束
   */
  function startPlan(plan) {
    createSession()
    return sendUserMessage(buildPlanRequestText(plan))
  }

  return {
    session,
    replyingSessionId,
    messages,
    isEmpty,
    isReplying,
    createSession,
    sendUserMessage,
    requestReply,
    retry,
    startPlan,
  }
})
