import { computed, inject, onScopeDispose, provide, ref } from 'vue'
import { LAYOUT_MODE, MEDIA_QUERIES } from '@/constants/breakpoints.js'
import { getLayoutFlags, resolveLayoutMode } from '@/utils/layout.js'

/** provide/inject 使用的键 */
const LAYOUT_KEY = Symbol('layout-mode')

/**
 * 由 MainLayout 调用:监听视口断点,维护布局模式并通过 provide 提供给子组件。
 * 使用与 SCSS 同源的 MEDIA_QUERIES 调用 matchMedia;matchMedia 不可用时,
 * 回退为按 window.innerWidth 一次性计算。
 *
 * @returns {{ mode: import('vue').Ref<string>, flags: import('vue').ComputedRef<object> }} 布局模式与布局标志
 */
export function provideLayoutMode() {
  const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  const desktopQuery = hasMatchMedia ? window.matchMedia(MEDIA_QUERIES.DESKTOP_UP) : null
  const tabletQuery = hasMatchMedia ? window.matchMedia(MEDIA_QUERIES.TABLET_UP) : null

  /** 根据当前媒体查询匹配结果计算模式 */
  function computeMode() {
    if (!desktopQuery || !tabletQuery) {
      return resolveLayoutMode(typeof window === 'undefined' ? 0 : window.innerWidth)
    }
    if (desktopQuery.matches) return LAYOUT_MODE.DESKTOP
    if (tabletQuery.matches) return LAYOUT_MODE.TABLET
    return LAYOUT_MODE.MOBILE
  }

  const mode = ref(computeMode())
  const flags = computed(() => getLayoutFlags(mode.value))

  const onChange = () => {
    mode.value = computeMode()
  }
  desktopQuery?.addEventListener('change', onChange)
  tabletQuery?.addEventListener('change', onChange)
  onScopeDispose(() => {
    desktopQuery?.removeEventListener('change', onChange)
    tabletQuery?.removeEventListener('change', onChange)
  })

  const layout = { mode, flags }
  provide(LAYOUT_KEY, layout)
  return layout
}

/**
 * 由子组件调用:读取 MainLayout 提供的布局模式。
 * 未提供时默认按桌面模式,方便组件单独测试。
 *
 * @returns {{ mode: import('vue').Ref<string>, flags: import('vue').ComputedRef<object> }} 布局模式与布局标志
 */
export function useLayoutMode() {
  const injected = inject(LAYOUT_KEY, null)
  if (injected) return injected

  const mode = ref(LAYOUT_MODE.DESKTOP)
  return { mode, flags: computed(() => getLayoutFlags(mode.value)) }
}
