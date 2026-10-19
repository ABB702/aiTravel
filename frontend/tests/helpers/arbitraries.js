import fc from 'fast-check'
import { BUDGET_RANGE } from '@/constants/budget.js'
import { TRAVELER_RANGE } from '@/constants/traveler.js'
import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants/message.js'
import { STORAGE_VERSION } from '@/constants/storage.js'

/** 毫秒时间戳上限(2100-01-01),避免生成超出 Date 范围的值 */
const MAX_TIMESTAMP = 4102444800000

/** String.prototype.trim 会去除的各类空白字符(含全角空格、制表符、换行、零宽不换行空格) */
const WHITESPACE_CHARS = [
  ' ',
  '\t',
  '\n',
  '\r',
  '\v',
  '\f',
  '\u00a0',
  '\u2003',
  '\u2028',
  '\u3000',
  '\ufeff',
]

/** 仅由空白字符组成的字符串(含空字符串) */
export const arbWhitespaceString = fc
  .array(fc.constantFrom(...WHITESPACE_CHARS), { maxLength: 12 })
  .map((chars) => chars.join(''))

/** 任意 JavaScript 值,覆盖数字边界、字符串、null、undefined 与对象 */
export const arbAnyValue = fc.oneof(
  fc.anything(),
  fc.double({ noNaN: false }),
  fc.integer(),
  fc.string(),
  fc.constantFrom(NaN, Infinity, -Infinity, 0, -1, null, undefined, '', '500', true, false),
)

/** 目的地:非空白且不含换行的字符串 */
const arbDestination = fc
  .string({ minLength: 1, maxLength: 20 })
  .filter((s) => s.trim().length > 0 && !/[\r\n\u2028\u2029]/.test(s))

/** 有效的旅程规划表单值(预算与人数在允许范围内) */
export const arbValidPlan = fc.record({
  destination: arbDestination,
  budget: fc.oneof(
    fc.integer({ min: BUDGET_RANGE.min, max: BUDGET_RANGE.max }),
    fc
      .double({ min: BUDGET_RANGE.min, max: BUDGET_RANGE.max, noNaN: true })
      .filter(Number.isFinite),
  ),
  travelerCount: fc.integer({ min: TRAVELER_RANGE.min, max: TRAVELER_RANGE.max }),
})

/** 任意旅程规划表单值(各字段可能无效、为空或类型错误) */
export const arbPlan = fc.record({
  destination: fc.oneof(fc.string(), arbWhitespaceString, fc.constant('')),
  budget: fc.oneof(fc.constant(null), arbAnyValue),
  travelerCount: fc.oneof(fc.constant(null), arbAnyValue),
})

/** 毫秒时间戳 */
const arbTimestamp = fc.integer({ min: 0, max: MAX_TIMESTAMP })

/** 非空 ID 字符串 */
const arbId = fc.string({ minLength: 1, maxLength: 16 }).filter((s) => s !== '')

/** 消息内容:包含 Unicode、换行、引号与反斜杠 */
const arbContent = fc.oneof(
  fc.string({ unit: 'binary', maxLength: 60 }),
  fc.constantFrom('', '多行\n文本', 'say "hi"', 'a\\b', '😀 emoji', '\u2028\u2029'),
)

/**
 * 构造消息生成器。
 * 助手消息状态恒为 sent;用户消息状态取 userStatuses 之一。
 *
 * @param {string[]} userStatuses 用户消息允许的状态
 */
function buildArbMessage(userStatuses) {
  return fc.oneof(
    fc.record({
      id: arbId,
      role: fc.constant(MESSAGE_ROLE.USER),
      content: arbContent,
      timestamp: arbTimestamp,
      status: fc.constantFrom(...userStatuses),
    }),
    fc.record({
      id: arbId,
      role: fc.constant(MESSAGE_ROLE.ASSISTANT),
      content: arbContent,
      timestamp: arbTimestamp,
      status: fc.constant(MESSAGE_STATUS.SENT),
    }),
  )
}

/** 有效消息(用户消息状态仅 sent / failed) */
export const arbMessage = buildArbMessage([MESSAGE_STATUS.SENT, MESSAGE_STATUS.FAILED])

/** 有效消息(用户消息状态可取 sending / sent / failed) */
export const arbMessageWithSending = buildArbMessage(Object.values(MESSAGE_STATUS))

/**
 * 构造会话生成器。
 *
 * @param {fc.Arbitrary} messageArb 消息生成器
 * @param {number} minMessages 最少消息数
 */
function buildArbSession(messageArb, minMessages = 0) {
  return fc.record({
    id: arbId,
    createdAt: arbTimestamp,
    messages: fc.array(messageArb, { minLength: minMessages, maxLength: 8 }),
  })
}

/** 有效会话(用户消息状态仅 sent / failed) */
export const arbSession = buildArbSession(arbMessage)

/** 有效会话(用户消息状态可含 sending) */
export const arbSessionWithSending = buildArbSession(arbMessageWithSending)

/**
 * 对有效持久化数据做破坏性变异,得到必然无效的 JSON 字符串。
 * 变异种类:版本不匹配、会话字段缺失或类型错误、消息字段缺失或类型错误、role/status 取非法值。
 */
export const arbCorruptedPersisted = fc
  .tuple(
    buildArbSession(arbMessageWithSending, 1),
    fc.nat(),
    fc.constantFrom(
      'version-mismatch',
      'session-null',
      'session-id-missing',
      'session-createdAt-string',
      'session-messages-object',
      'message-id-missing',
      'message-content-missing',
      'message-timestamp-string',
      'message-role-invalid',
      'message-status-invalid',
    ),
  )
  .map(([session, index, kind]) => {
    const persisted = { version: STORAGE_VERSION, session: structuredClone(session) }
    const message = persisted.session.messages[index % persisted.session.messages.length]
    switch (kind) {
      case 'version-mismatch':
        persisted.version = STORAGE_VERSION + 1
        break
      case 'session-null':
        persisted.session = null
        break
      case 'session-id-missing':
        delete persisted.session.id
        break
      case 'session-createdAt-string':
        persisted.session.createdAt = 'yesterday'
        break
      case 'session-messages-object':
        persisted.session.messages = {}
        break
      case 'message-id-missing':
        delete message.id
        break
      case 'message-content-missing':
        delete message.content
        break
      case 'message-timestamp-string':
        message.timestamp = 'now'
        break
      case 'message-role-invalid':
        message.role = 'system'
        break
      case 'message-status-invalid':
        message.status = 'pending'
        break
    }
    return JSON.stringify(persisted)
  })

/** 可能为空的字符串字段:空串、空白、null、undefined 或普通字符串 */
const arbOptionalText = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.constant(''),
  arbWhitespaceString,
  fc.string({ minLength: 1, maxLength: 30 }),
)

/** 有效的本地日期(1971 至 2100 年) */
export const arbValidDate = fc.date({
  min: new Date(1971, 0, 1),
  max: new Date(2100, 0, 1),
  noInvalidDate: true,
})

/** 用户资料:各字段可为空;注册时间要么为空要么为有效 ISO 字符串 */
export const arbProfile = fc.record({
  avatar: arbOptionalText,
  nickname: arbOptionalText,
  userId: arbOptionalText,
  gender: arbOptionalText,
  city: arbOptionalText,
  bio: arbOptionalText,
  registeredAt: fc.oneof(
    fc.constant(null),
    fc.constant(undefined),
    fc.constant(''),
    arbWhitespaceString,
    arbValidDate.map((date) => date.toISOString()),
  ),
})

/**
 * 按时间戳非递减排序的非空时间戳序列。
 * 相邻间隔刻意覆盖 0、299999、300000、300001 等边界(时间分隔阈值为 300000ms)。
 */
export const arbSortedTimestamps = fc
  .tuple(
    fc.integer({ min: 0, max: 1_000_000_000_000 }),
    fc.array(
      fc.oneof(
        fc.constantFrom(0, 1, 299999, 300000, 300001, 600000),
        fc.integer({ min: 0, max: 1_000_000 }),
      ),
      { maxLength: 15 },
    ),
  )
  .map(([start, gaps]) => {
    const timestamps = [start]
    for (const gap of gaps) {
      timestamps.push(timestamps[timestamps.length - 1] + gap)
    }
    return timestamps
  })
