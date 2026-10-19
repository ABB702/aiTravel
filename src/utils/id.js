/**
 * 生成唯一 ID。
 * 优先使用 crypto.randomUUID();在非安全上下文(如通过 HTTP 局域网访问)中该方法不可用,
 * 此时回退为 `时间戳36进制-随机串`。
 *
 * @returns {string} 非空字符串 ID
 */
export function generateId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  const random = Math.random().toString(36).slice(2, 10).padEnd(8, '0')
  return `${Date.now().toString(36)}-${random}`
}
