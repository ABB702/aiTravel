<script setup>
import { watch } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AsideDrawer from '@/components/layout/AsideDrawer.vue'
import AsidePanel from '@/components/layout/AsidePanel.vue'
import BottomTabBar from '@/components/layout/BottomTabBar.vue'
import { useAsideDrawer } from '@/composables/useAsideDrawer.js'
import { provideLayoutMode } from '@/composables/useLayoutMode.js'
import { useViewportHeight } from '@/composables/useViewportHeight.js'
import { MENU_ITEMS } from '@/constants/menu.js'
import { usePlanStore } from '@/stores/plan.js'
import { nextDrawerOpen } from '@/utils/layout.js'

/**
 * 应用主布局:
 * - 桌面:导航栏 | 主内容 | 辅助信息栏
 * - 平板:折叠导航栏 | 主内容(辅助信息通过抽屉查看)
 * - 手机:主内容 / 底部标签栏(辅助信息通过抽屉查看)
 */
const { mode, flags } = provideLayoutMode()
useViewportHeight()

const planStore = usePlanStore()
const { visible: drawerVisible } = useAsideDrawer()

// 跨入桌面模式时强制关闭抽屉,避免从桌面缩小后抽屉意外残留
watch(mode, (value) => {
  drawerVisible.value = nextDrawerOpen(drawerVisible.value, value)
})
</script>

<template>
  <div class="app-shell">
    <AppSidebar v-if="flags.showSidebar" :items="MENU_ITEMS" :collapsed="flags.sidebarCollapsed" />
    <main class="main-content">
      <RouterView />
    </main>
    <AsidePanel v-if="flags.showAsidePanel" :trip="planStore.plan" />
    <BottomTabBar v-if="flags.showBottomTabBar" :items="MENU_ITEMS" />
    <AsideDrawer v-if="flags.allowAsideDrawer" v-model="drawerVisible" :trip="planStore.plan" />
  </div>
</template>

<style scoped lang="scss">
// 移动端优先:默认纵向排列(主内容在上,底部标签栏在下),平板及以上改为横向
.app-shell {
  position: fixed;
  top: var(--app-offset-top, 0);
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: var(--app-height, 100dvh);
  background: var(--color-bg);

  @media #{$mq-tablet-up} {
    flex-direction: row;
  }
}

// 内容过高时在自身区域内滚动;min-width: 0 避免子元素撑出横向滚动条
.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
