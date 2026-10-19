/**
 * 安全读取 localStorage。
 * 存储不可用(隐私模式、被禁用等)或读取抛错时返回 null。
 *
 * @param {string} key 键名
 * @returns {string | null} 读取到的字符串;不存在或失败时为 null
 */
export function safeGetItem(key) {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`[storage] 读取 "${key}" 失败:`, error)
    return null
  }
}

/**
 * 安全写入 localStorage。
 * 配额已满或存储不可用时捕获异常,不向外抛出。
 *
 * @param {string} key 键名
 * @param {string} value 要写入的字符串
 * @returns {boolean} 写入成功返回 true,失败返回 false
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`[storage] 写入 "${key}" 失败:`, error)
    return false
  }
}

/**
 * 安全删除 localStorage 中的键。
 *
 * @param {string} key 键名
 * @returns {boolean} 删除成功返回 true,失败返回 false
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`[storage] 删除 "${key}" 失败:`, error)
    return false
  }
}
