import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants/message.js'
import { createMessage } from '@/utils/chat.js'
import { isMockEnabled } from '@/utils/env.js'
import { ApiError } from './errors.js'
import { http } from './http.js'
import { generateReply, getMockDelay } from './mock/chatMock.js'

/**
 * 等待指定毫秒数。
 *
 * @param {number} ms 毫秒数
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 发送对话上下文并获取助手回复。
 * - Mock 模式(VITE_USE_MOCK 不为 'false'):本地生成回复,并模拟 500 至 1500ms 的延迟。
 * - 真实模式:`POST /chat/messages`,请求体 `{ messages: [{ role, content, timestamp }] }`,
 *   响应 data 为 `{ content }`。请求带 `silent: true`,失败由消息状态与"重试"按钮体现。
 *
 * @param {Array<{ role: string, content: string, timestamp: number }>} messages 对话上下文
 * @returns {Promise<{ id: string, role: string, content: string, timestamp: number, status: string }>} 助手消息
 * @throws {import('./errors.js').ApiError} 请求失败或响应格式不正确时抛出
 */
export async function sendChatMessage(messages) {
  let content

  if (isMockEnabled(import.meta.env.VITE_USE_MOCK)) {
    await sleep(getMockDelay())
    content = generateReply(messages)
  } else {
    const payload = {
      messages: messages.map(({ role, content: text, timestamp }) => ({
        role,
        content: text,
        timestamp,
      })),
    }
    const data = await http.post('/chat/messages', payload, { silent: true })
    if (typeof data?.content !== 'string') {
      throw new ApiError({ message: '响应格式不正确', type: 'business' })
    }
    content = data.content
  }

  return createMessage({ role: MESSAGE_ROLE.ASSISTANT, status: MESSAGE_STATUS.SENT, content })
}
