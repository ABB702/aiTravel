import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants/message.js'
import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage.js'
import { createEmptySession } from './chat.js'
import { safeGetItem, safeSetItem } from './storage.js'

const ROLE_VALUES = Object.values(MESSAGE_ROLE)
const STATUS_VALUES = Object.values(MESSAGE_STATUS)

/**
 * 判断值是否为普通对象(非 null、非数组)。
 *
 * @param {unknown} value 待判断的值
 * @returns {boolean} 是普通对象返回 true
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 校验消息结构是否合法。
 *
 * @param {unknown} message 待校验的值
 * @returns {boolean} 合法返回 true
 */
export function isValidMessage(message) {
  return (
    isRecord(message) &&
    typeof message.id === 'string' &&
    message.id !== '' &&
    ROLE_VALUES.includes(message.role) &&
    typeof message.content === 'string' &&
    typeof message.timestamp === 'number' &&
    Number.isFinite(message.timestamp) &&
    STATUS_VALUES.includes(message.status)
  )
}

/**
 * 校验会话结构是否合法。
 *
 * @param {unknown} session 待校验的值
 * @returns {boolean} 合法返回 true
 */
export function isValidSession(session) {
  return (
    isRecord(session) &&
    typeof session.id === 'string' &&
    session.id !== '' &&
    typeof session.createdAt === 'number' &&
    Number.isFinite(session.createdAt) &&
    Array.isArray(session.messages) &&
    session.messages.every(isValidMessage)
  )
}

/**
 * 将会话序列化为 JSON 字符串,格式为 `{ version, session }`。
 *
 * @param {{ id: string, createdAt: number, messages: Array }} session 会话
 * @returns {string} JSON 字符串
 */
export function serializeSession(session) {
  return JSON.stringify({ version: STORAGE_VERSION, session })
}

/**
 * 将 JSON 字符串反序列化为会话。
 * - 输入为 null/undefined(存储中没有数据)时静默返回空会话。
 * - 无效 JSON、结构不合法或版本不一致时,在控制台告警并返回空会话。
 * - 仅拷贝已知字段,未知字段会被丢弃。
 * - 状态为 sending 的用户消息会被修正为 failed(刷新后请求已丢失)。
 *
 * @param {string | null | undefined} raw 本地存储中的原始字符串
 * @returns {{ id: string, createdAt: number, messages: Array }} 会话
 */
export function deserializeSession(raw) {
  if (raw === null || raw === undefined) return createEmptySession()

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.warn('[chatStorage] 会话数据不是有效的 JSON,已丢弃')
    return createEmptySession()
  }

  if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !isValidSession(parsed.session)) {
    console.warn('[chatStorage] 会话数据结构不合法或版本不一致,已丢弃')
    return createEmptySession()
  }

  const { id, createdAt, messages } = parsed.session
  return {
    id,
    createdAt,
    messages: messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      status:
        message.role === MESSAGE_ROLE.USER && message.status === MESSAGE_STATUS.SENDING
          ? MESSAGE_STATUS.FAILED
          : message.status,
    })),
  }
}

/**
 * 从本地存储加载当前会话;没有数据或数据无效时返回空会话。
 *
 * @returns {{ id: string, createdAt: number, messages: Array }} 会话
 */
export function loadSession() {
  return deserializeSession(safeGetItem(STORAGE_KEYS.CHAT_SESSION))
}

/**
 * 将会话写入本地存储。写入失败时不抛出,也不改变传入的会话。
 *
 * @param {{ id: string, createdAt: number, messages: Array }} session 会话
 * @returns {boolean} 写入成功返回 true,失败返回 false
 */
export function saveSession(session) {
  return safeSetItem(STORAGE_KEYS.CHAT_SESSION, serializeSession(session))
}
