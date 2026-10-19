/**
 * 将任意输入转换为有效的 Date 对象。
 * 仅接受毫秒时间戳(有限数字)、可解析的字符串和 Date 实例,其余一律视为无效。
 *
 * @param {number | string | Date | null | undefined} value 待转换的值
 * @returns {Date | null} 有效时返回 Date,否则返回 null
 */
function toDate(value) {
  let date = null
  if (value instanceof Date) {
    date = new Date(value.getTime())
  } else if (typeof value === 'number' && Number.isFinite(value)) {
    date = new Date(value)
  } else if (typeof value === 'string' && value.trim() !== '') {
    date = new Date(value)
  }
  return date && !Number.isNaN(date.getTime()) ? date : null
}

/**
 * 数字左侧补零。
 *
 * @param {number} n 非负整数
 * @param {number} [length=2] 目标长度
 * @returns {string} 补零后的字符串
 */
function pad(n, length = 2) {
  return String(n).padStart(length, '0')
}

/**
 * 获取本地时区下的 `HH:mm`。
 *
 * @param {Date} date 有效日期
 * @returns {string} 时分字符串
 */
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 判断两个日期在本地时区下是否为同一个日历日。
 *
 * @param {Date} a 日期 a
 * @param {Date} b 日期 b
 * @returns {boolean} 同一天返回 true
 */
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * 格式化为 `YYYY-MM-DD`(本地时区)。
 *
 * @param {number | string | Date | null | undefined} value 毫秒时间戳、ISO 字符串或 Date
 * @returns {string} 格式化结果;输入无效时返回空字符串
 * @example
 * formatDate('2024-03-05T08:00:00') // '2024-03-05'
 */
export function formatDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * 格式化为 `YYYY-MM-DD HH:mm:ss`(本地时区)。
 *
 * @param {number | string | Date | null | undefined} value 毫秒时间戳、ISO 字符串或 Date
 * @returns {string} 格式化结果;输入无效时返回空字符串
 * @example
 * formatDateTime(new Date(2024, 2, 5, 8, 9, 10)) // '2024-03-05 08:09:10'
 */
export function formatDateTime(value) {
  const date = toDate(value)
  if (!date) return ''
  const time = `${formatTime(date)}:${pad(date.getSeconds())}`
  return `${formatDate(date)} ${time}`
}

/**
 * 按聊天场景格式化时间(本地时区)。
 * - 与 now 同一天:`HH:mm`
 * - now 的前一天:`昨天 HH:mm`
 * - 同一年的其他日期:`M月D日 HH:mm`
 * - 其他:`YYYY年M月D日 HH:mm`
 *
 * @param {number | string | Date | null | undefined} value 毫秒时间戳、ISO 字符串或 Date
 * @param {number | string | Date} [now=Date.now()] 当前时间,默认取系统时间,便于测试注入
 * @returns {string} 格式化结果;value 或 now 无效时返回空字符串
 * @example
 * formatChatTime(new Date(2024, 2, 4, 9, 30), new Date(2024, 2, 5, 12, 0)) // '昨天 09:30'
 */
export function formatChatTime(value, now = Date.now()) {
  const date = toDate(value)
  const current = toDate(now)
  if (!date || !current) return ''

  const time = formatTime(date)
  if (isSameDay(date, current)) return time

  // 通过本地日历回退一天得到"昨天",可正确处理夏令时与月初、年初
  const yesterday = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1)
  if (isSameDay(date, yesterday)) return `昨天 ${time}`

  const monthDay = `${date.getMonth() + 1}月${date.getDate()}日 ${time}`
  if (date.getFullYear() === current.getFullYear()) return monthDay
  return `${date.getFullYear()}年${monthDay}`
}
