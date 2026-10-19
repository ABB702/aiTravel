import { BREAKPOINTS, LAYOUT_MODE } from '@/constants/breakpoints.js'

/**
 * 根据视口宽度判定布局模式。
 * 宽度 >= 1200 为桌面,>= 768 为平板,其余为手机。断点取自 BREAKPOINTS。
 *
 * @param {number} width 视口宽度(px)
 * @returns {'mobile' | 'tablet' | 'desktop'} 布局模式
 */
export function resolveLayoutMode(width) {
  if (width >= BREAKPOINTS.DESKTOP) return LAYOUT_MODE.DESKTOP
  if (width >= BREAKPOINTS.TABLET) return LAYOUT_MODE.TABLET
  return LAYOUT_MODE.MOBILE
}

/**
 * 获取指定布局模式下的结构性渲染标志(决定渲染哪些组件)。
 *
 * @param {'mobile' | 'tablet' | 'desktop'} mode 布局模式
 * @returns {{
 *   showSidebar: boolean,
 *   sidebarCollapsed: boolean,
 *   showBottomTabBar: boolean,
 *   showAsidePanel: boolean,
 *   showSummaryBar: boolean,
 *   allowAsideDrawer: boolean
 * }} 布局标志
 */
export function getLayoutFlags(mode) {
  const isDesktop = mode === LAYOUT_MODE.DESKTOP
  const isTablet = mode === LAYOUT_MODE.TABLET
  const isMobile = !isDesktop && !isTablet
  return {
    showSidebar: isDesktop || isTablet,
    sidebarCollapsed: isTablet,
    showBottomTabBar: isMobile,
    showAsidePanel: isDesktop,
    showSummaryBar: !isDesktop,
    allowAsideDrawer: !isDesktop,
  }
}

/**
 * 计算布局模式变化后抽屉的打开状态。
 * 桌面模式下不存在抽屉,强制关闭;其他模式保持原状态。
 *
 * @param {boolean} open 当前抽屉是否打开
 * @param {'mobile' | 'tablet' | 'desktop'} mode 当前布局模式
 * @returns {boolean} 变化后的打开状态
 */
export function nextDrawerOpen(open, mode) {
  return mode === LAYOUT_MODE.DESKTOP ? false : open
}
