<script setup>
import { APP_TITLE } from '@/constants/app.js'

/** 左侧导航栏:展开态显示图标与文字,折叠态只显示图标(文字通过提示显示) */
defineProps({
  /** 菜单项列表,见 MENU_ITEMS */
  items: { type: Array, required: true },
  /** 是否折叠(仅图标) */
  collapsed: { type: Boolean, default: false },
})
</script>

<template>
  <nav class="app-sidebar" :class="{ 'app-sidebar--collapsed': collapsed }" aria-label="主导航">
    <div class="app-sidebar__brand" aria-hidden="true">
      <el-icon :size="24"><Compass /></el-icon>
      <span v-if="!collapsed" class="app-sidebar__brand-text">{{ APP_TITLE }}</span>
    </div>
    <ul class="app-sidebar__list">
      <li v-for="item in items" :key="item.key">
        <el-tooltip
          :content="item.label"
          :disabled="!collapsed"
          :trigger="['hover', 'focus']"
          placement="right"
        >
          <RouterLink
            :to="item.path"
            class="app-sidebar__link"
            active-class="is-active"
            :aria-label="item.label"
          >
            <el-icon :size="20"><component :is="item.icon" /></el-icon>
            <span v-if="!collapsed" class="app-sidebar__label">{{ item.label }}</span>
          </RouterLink>
        </el-tooltip>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex: 0 0 var(--sidebar-width);
  flex-direction: column;
  width: var(--sidebar-width);
  padding: var(--space-4) var(--space-2);
  overflow-y: auto;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.app-sidebar--collapsed {
  flex-basis: var(--sidebar-collapsed-width);
  width: var(--sidebar-collapsed-width);
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-4);
  color: var(--color-primary);
  font-weight: 600;
}

.app-sidebar--collapsed .app-sidebar__brand {
  justify-content: center;
  padding-inline: 0;
}

.app-sidebar__list {
  display: flex;
  flex-direction: column;
  gap: var(--touch-gap-min);
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--touch-target-min);
  padding: 0 var(--space-3);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.app-sidebar--collapsed .app-sidebar__link {
  justify-content: center;
  padding-inline: 0;
}

.app-sidebar__link:hover {
  background: var(--color-primary-light);
}

.app-sidebar__link.is-active {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-primary-light);
}
</style>
