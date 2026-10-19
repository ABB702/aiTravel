import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes.js'

/**
 * 路由表。所有页面都作为 MainLayout 的子路由,404 页面同样显示在布局中。
 * 页面组件使用懒加载;路径与名称全部引用 constants/routes.js。
 */
export const routes = [
  {
    path: ROUTE_PATHS.ROOT,
    component: MainLayout,
    redirect: ROUTE_PATHS.HOME,
    children: [
      {
        path: ROUTE_PATHS.HOME,
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/home/HomePage.vue'),
      },
      {
        path: ROUTE_PATHS.CHAT,
        name: ROUTE_NAMES.CHAT,
        component: () => import('@/views/chat/ChatPage.vue'),
      },
      {
        path: ROUTE_PATHS.PROFILE,
        name: ROUTE_NAMES.PROFILE,
        component: () => import('@/views/profile/ProfilePage.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/views/not-found/NotFoundPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 懒加载的页面模块加载失败(如网络中断、部署更新)时提示用户刷新
router.onError(() => {
  ElMessage.error('页面加载失败,请刷新重试')
})

export default router
