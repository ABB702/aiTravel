import { nextTick, ref, shallowRef } from 'vue'

// 模块级单例状态:SummaryBar(页面内)与 AsideDrawer(布局内)共享同一份
const visible = ref(false)
/** 触发抽屉打开的元素,关闭后用于归还焦点 */
const triggerEl = shallowRef(null)

/**
 * 辅助信息抽屉的开关状态。
 *
 * @returns {{
 *   visible: import('vue').Ref<boolean>,
 *   triggerEl: import('vue').ShallowRef<HTMLElement | null>,
 *   open: (el?: HTMLElement | null) => void,
 *   close: () => void,
 *   restoreFocus: () => void
 * }} 抽屉状态与操作方法
 */
export function useAsideDrawer() {
  /**
   * 打开抽屉并记录触发元素。
   *
   * @param {HTMLElement | null} [el] 触发元素,缺省时取当前获得焦点的元素
   */
  function open(el) {
    triggerEl.value = el ?? (typeof document === 'undefined' ? null : document.activeElement)
    visible.value = true
  }

  /** 关闭抽屉 */
  function close() {
    visible.value = false
  }

  /** 兜底把焦点归还给触发元素(ElDrawer 内置焦点返回失效时使用) */
  function restoreFocus() {
    const el = triggerEl.value
    if (el && typeof el.focus === 'function') {
      nextTick(() => el.focus())
    }
  }

  return { visible, triggerEl, open, close, restoreFocus }
}
