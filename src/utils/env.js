/**
 * 判断是否启用 Mock。
 * 仅当原始值恰好为字符串 'false' 时关闭,其余取值(含未设置)均启用。
 *
 * @param {unknown} raw 环境变量原始值,通常为 import.meta.env.VITE_USE_MOCK
 * @returns {boolean} 启用 Mock 返回 true
 * @example
 * isMockEnabled('false') // false
 * isMockEnabled(undefined) // true
 */
export function isMockEnabled(raw) {
  return raw !== 'false'
}
