/**
 * 使用隐藏的 textarea 配合 document.execCommand('copy') 复制文本(旧浏览器回退方案)。
 *
 * @param {string} text 要复制的文本
 * @returns {boolean} 复制成功返回 true
 */
function legacyCopy(text) {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  try {
    textarea.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * 复制文本到剪贴板。
 * 优先使用异步 Clipboard API;不可用或被拒绝时回退到 execCommand。
 *
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>} 复制成功为 true,失败为 false(不会抛出)
 */
export async function copyText(text) {
  if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 权限被拒绝或非安全上下文时继续走回退方案
    }
  }
  return legacyCopy(text)
}
