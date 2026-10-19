import { nextTick, watch } from 'vue'

/**
 * 聊天列表自动滚动到底部。
 * 依赖项变化后,在 DOM 更新完成(nextTick)后把容器滚动到最底部。
 *
 * @param {import('vue').Ref<HTMLElement | null>} containerRef 滚动容器的模板引用
 * @param {Array<import('vue').WatchSource>} deps 触发滚动的依赖(例如消息数量、是否正在回复)
 * @returns {{ scrollToBottom: () => Promise<void> }} 手动滚动到底部的方法
 */
export function useChatScroll(containerRef, deps) {
  /** 等待 DOM 更新后滚动到底部 */
  async function scrollToBottom() {
    await nextTick()
    const el = containerRef.value
    if (el) el.scrollTop = el.scrollHeight
  }

  watch(deps, scrollToBottom, { flush: 'post' })

  return { scrollToBottom }
}
