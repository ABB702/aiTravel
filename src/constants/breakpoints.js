/**
 * 响应式断点常量。
 *
 * 注意:本文件会被 vite.config.js 在 Node 环境中直接导入,
 * 因此必须保持纯 ESM,不得依赖 Vue 或任何浏览器 API。
 */

/** 断点宽度(单位:px)。样式采用移动端优先,仅使用 min-width 查询。 */
export const BREAKPOINTS = {
  /** 平板起始宽度:>= 768 为平板 */
  TABLET: 768,
  /** 桌面起始宽度:>= 1200 为桌面 */
  DESKTOP: 1200,
}

/** 布局模式枚举 */
export const LAYOUT_MODE = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
}

/**
 * 媒体查询字符串,由 BREAKPOINTS 拼接而成。
 * JS(matchMedia)与 SCSS($mq-tablet-up / $mq-desktop-up)共用同一来源。
 */
export const MEDIA_QUERIES = {
  TABLET_UP: `(min-width: ${BREAKPOINTS.TABLET}px)`,
  DESKTOP_UP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
}
