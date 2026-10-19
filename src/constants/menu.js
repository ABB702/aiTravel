import { ROUTE_NAMES, ROUTE_PATHS } from './routes.js'

/**
 * 导航菜单配置。
 * icon 保存 @element-plus/icons-vue 的图标名称字符串,常量层不依赖组件。
 *
 * @type {Array<{ key: string, label: string, routeName: string, path: string, icon: string }>}
 */
export const MENU_ITEMS = [
  {
    key: 'home',
    label: '首页',
    routeName: ROUTE_NAMES.HOME,
    path: ROUTE_PATHS.HOME,
    icon: 'House',
  },
  {
    key: 'chat',
    label: '对话',
    routeName: ROUTE_NAMES.CHAT,
    path: ROUTE_PATHS.CHAT,
    icon: 'ChatDotRound',
  },
  {
    key: 'profile',
    label: '我的',
    routeName: ROUTE_NAMES.PROFILE,
    path: ROUTE_PATHS.PROFILE,
    icon: 'User',
  },
]
