import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants/message.js'
import { TIME_DIVIDER_GAP_MS } from '@/constants/chat.js'
import { formatChatTime } from './datetime.js'
import { generateId } from './id.js'

/**
 * 创建一条消息,并为缺省的 id、timestamp、status 填充默认值。
 * status 默认:助手消息为 sent,用户消息为 sending。
 *
 * @param {{
 *   id?: string,
 *   role?: 'user' | 'assistant',
 *   content?: string,
 *   timestamp?: number,
 *   status?: 'sending' | 'sent' | 'failed'
 * }} [init] 初始字段
 * @returns {{ id: string, role: string, content: string, timestamp: number, status: string }} 消息
 */
export function createMessage(init = {}) {
  const role = init.role ?? MESSAGE_ROLE.USER
  return {
    id: init.id ?? generateId(),
    role,
    content: init.content ?? '',
    timestamp: init.timestamp ?? Date.now(),
    status:
      init.status ??
      (role === MESSAGE_ROLE.ASSISTANT ? MESSAGE_STATUS.SENT : MESSAGE_STATUS.SENDING),
  }
}

/**
 * 创建一个空会话。
 *
 * @returns {{ id: string, createdAt: number, messages: Array }} 空会话
 */
export function createEmptySession() {
  return { id: generateId(), createdAt: Date.now(), messages: [] }
}

/**
 * 将消息列表转换为带时间分隔项的聊天列表项。
 * 在第一条消息之前,以及与前一条消息的时间间隔严格大于 gapMs 的消息之前,插入一个分隔项。
 *
 * @param {Array<{ id: string, timestamp: number }>} messages 按时间排序的消息列表
 * @param {number} [gapMs=TIME_DIVIDER_GAP_MS] 触发分隔的最小间隔(毫秒,严格大于)
 * @returns {Array<
 *   { type: 'divider', key: string, timestamp: number, label: string } |
 *   { type: 'message', key: string, message: object }
 * >} 列表项
 */
export function buildChatItems(messages, gapMs = TIME_DIVIDER_GAP_MS) {
  const items = []
  messages.forEach((message, index) => {
    const previous = messages[index - 1]
    if (index === 0 || message.timestamp - previous.timestamp > gapMs) {
      items.push({
        type: 'divider',
        key: `divider-${message.id}`,
        timestamp: message.timestamp,
        label: formatChatTime(message.timestamp),
      })
    }
    items.push({ type: 'message', key: `message-${message.id}`, message })
  })
  return items
}
