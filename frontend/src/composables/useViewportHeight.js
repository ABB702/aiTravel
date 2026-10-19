import { onBeforeUnmount, onMounted, ref } from 'vue'

// 模块级共享状态:MainLayout 负责监听,ChatPage 等组件只读取
const viewportHeight = ref(typeof window === 'undefined' ? 0 : window.innerHeight)

/**
 * 读取当前可视视口高度(px),不注册任何监听。
 * 需要在软键盘弹出(高度变小)时做响应的组件使用,例如 ChatPage。
 *
 * @returns {import('vue').Ref<number>} 可视视口高度
 */
export function useViewportHeightState() {
  return viewportHeight
}

/**
 * 跟踪可视视口高度,解决手机软键盘弹出时输入区被遮挡的问题。
 * 监听 window.visualViewport 的 resize 与 scroll,把高度与顶部偏移写入
 * CSS 变量 `--app-height` 与 `--app-offset-top`;不支持 visualViewport 时不写入,
 * 样式回退为 `100dvh`。应只在 MainLayout 中调用一次。
 *
 * @returns {{ viewportHeight: import('vue').Ref<number> }} 当前可视视口高度(px)
 */
export function useViewportHeight() {
  const viewport = typeof window === 'undefined' ? null : window.visualViewport

  /** 把可视视口尺寸同步到 CSS 变量 */
  function update() {
    if (!viewport) return
    viewportHeight.value = viewport.height
    const root = document.documentElement
    root.style.setProperty('--app-height', `${viewport.height}px`)
    root.style.setProperty('--app-offset-top', `${viewport.offsetTop}px`)
  }

  onMounted(() => {
    if (!viewport) return
    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
  })

  onBeforeUnmount(() => {
    if (!viewport) return
    viewport.removeEventListener('resize', update)
    viewport.removeEventListener('scroll', update)
    document.documentElement.style.removeProperty('--app-height')
    document.documentElement.style.removeProperty('--app-offset-top')
  })

  return { viewportHeight }
}
