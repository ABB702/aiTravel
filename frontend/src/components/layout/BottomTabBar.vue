<script setup>
/** 手机端底部导航栏:每项包含图标与文字,当前路由高亮 */
defineProps({
  /** 菜单项列表,见 MENU_ITEMS */
  items: { type: Array, required: true },
})
</script>

<template>
  <nav class="bottom-tab-bar" aria-label="底部导航">
    <RouterLink
      v-for="item in items"
      :key="item.key"
      :to="item.path"
      class="bottom-tab-bar__item"
      active-class="is-active"
    >
      <el-icon :size="22"><component :is="item.icon" /></el-icon>
      <span class="bottom-tab-bar__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-tab-bar {
  display: flex;
  flex: 0 0 auto;
  height: var(--tab-bar-height);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.bottom-tab-bar__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  text-decoration: none;
}

.bottom-tab-bar__item.is-active {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
